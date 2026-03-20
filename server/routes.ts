import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema } from "../shared/schema";
import { fromZodError } from "zod-validation-error";

interface SymptomData {
    common: string[];
    urgent: string[];
    symptoms: string[];
    urgency: "low" | "medium" | "high" | "critical";
}

const DISEASE_DATA: Record<string, SymptomData> = {
    fever: {
        common: ["Common cold", "Flu", "Viral infection"],
        urgent: ["Meningitis", "Sepsis", "Pneumonia"],
        symptoms: ["chills", "sweating", "headache", "muscle aches", "weakness"],
        urgency: "medium",
    },
    cough: {
        common: ["Common cold", "Bronchitis", "Allergies"],
        urgent: ["Pneumonia", "Asthma exacerbation", "COPD"],
        symptoms: ["shortness of breath", "chest pain", "wheezing", "phlegm"],
        urgency: "low",
    },
    "chest pain": {
        common: ["Acid reflux", "Muscle strain", "Anxiety"],
        urgent: ["Heart attack", "Pulmonary embolism", "Aortic dissection"],
        symptoms: ["pressure", "tightness", "radiating pain", "nausea", "sweating"],
        urgency: "critical",
    },
    headache: {
        common: ["Tension headache", "Migraine", "Dehydration"],
        urgent: ["Stroke", "Aneurysm", "Brain tumor"],
        symptoms: ["vision changes", "numbness", "confusion", "stiff neck"],
        urgency: "medium",
    },
    "stomach pain": {
        common: ["Indigestion", "Gas", "Viral gastroenteritis"],
        urgent: ["Appendicitis", "Bowel obstruction", "Internal bleeding"],
        symptoms: ["nausea", "vomiting", "fever", "tenderness", "bloating"],
        urgency: "medium",
    },
};

function analyzeSymptoms(input: string) {
    const normalized = input.toLowerCase();
    const matchedDiseases: Record<string, number> = {};
    let maxUrgency: "low" | "medium" | "high" | "critical" = "low";

    const urgencyOrder = ["low", "medium", "high", "critical"];

    for (const [disease, data] of Object.entries(DISEASE_DATA)) {
        let score = 0;
        if (normalized.includes(disease)) {
            score += 50;
            if (urgencyOrder.indexOf(data.urgency) > urgencyOrder.indexOf(maxUrgency)) {
                maxUrgency = data.urgency;
            }
        }

        for (const symptom of data.symptoms) {
            if (normalized.includes(symptom)) {
                score += 10;
            }
        }

        if (score > 0) {
            matchedDiseases[disease] = score;
        }
    }

    return { matchedDiseases, urgencyLevel: maxUrgency };
}

function generateVedicResponse(userInput: string, historyLength: number) {
    if (historyLength === 0) {
        return "Namaste! I am VEDIC, your Symptom-Sage. I can help you understand your symptoms and suggest next steps. Please note that I am NOT a doctor. What symptoms are you experiencing today?";
    }

    const { matchedDiseases, urgencyLevel } = analyzeSymptoms(userInput);
    const topDiseases = Object.entries(matchedDiseases)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    let response = "";
    const badges: Record<string, string> = {
        low: "✅",
        medium: "⚠️",
        high: "🚨",
        critical: "🆘",
    };

    response += `${badges[urgencyLevel]} **Urgency Level: ${urgencyLevel.toUpperCase()}**\n\n`;

    if (topDiseases.length > 0) {
        response += "Based on your symptoms, here are some possible conditions to discuss with a professional:\n";
        topDiseases.forEach(([disease, score]) => {
            const confidence = Math.min(score, 95);
            response += `- **${disease.charAt(0).toUpperCase() + disease.slice(1)}** (Approx. ${confidence}% match)\n`;
        });
    } else {
        response += "I couldn't match your symptoms to specific common conditions. This might be something unique or less common.\n";
    }

    response += "\n**Next Steps:**\n";
    if (urgencyLevel === "critical" || urgencyLevel === "high") {
        response += "❗️ **PLEASE SEEK IMMEDIATE MEDICAL ATTENTION.** Call emergency services or go to the nearest ER.\n";
    } else {
        response += "- Monitor your symptoms for the next 24-48 hours.\n- Stay hydrated and rest.\n- Consult a primary care physician if symptoms persist or worsen.\n";
    }

    response += "\n*Disclaimer: I am an AI assistant and do not provide medical advice. This is for informational purposes only.*";

    return response;
}

export async function registerRoutes(app: Express): Promise<Server> {
    app.get("/api/chat/:sessionId", async (req, res) => {
        try {
            const messages = await storage.getMessages(req.params.sessionId);
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch chat history" });
        }
    });

    app.post("/api/chat", async (req, res) => {
        const result = chatRequestSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: fromZodError(result.error).message });
        }

        const { message, sessionId } = result.data;

        try {
            const history = await storage.getMessages(sessionId);

            // Save user message
            await storage.createMessage({
                sessionId,
                role: "user",
                content: message,
            });

            // Generate Vedic response
            const vedicResponse = generateVedicResponse(message, history.length);
            const { urgencyLevel } = analyzeSymptoms(message);

            // Save Vedic message
            const savedVedic = await storage.createMessage({
                sessionId,
                role: "vedic",
                content: vedicResponse,
                urgency: urgencyLevel,
            });

            res.json(savedVedic);
        } catch (error) {
            res.status(500).json({ error: "Failed to process message" });
        }
    });

    app.delete("/api/chat/:sessionId", async (req, res) => {
        try {
            await storage.clearMessages(req.params.sessionId);
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ error: "Failed to clear chat history" });
        }
    });

    const httpServer = createServer(app);
    return httpServer;
}
