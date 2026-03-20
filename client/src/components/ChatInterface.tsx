import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/use-chat";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, BrainCircuit, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export default function ChatInterface() {
    const { messages, isLoading, sendMessage, isSending, clearChat } = useChat();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isSending]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;
        sendMessage(input);
        setInput("");
    };

    const examples = [
        "I have a fever and a dry cough.",
        "My chest feels tight and I'm sweating.",
        "Sharp stomach pain after eating.",
    ];

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <BrainCircuit className="w-8 h-8 text-orange-400 opacity-50" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative">
            <div className="absolute top-4 right-4 z-20">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clearChat()}
                    className="text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Clear History"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
                <div className="space-y-6 max-w-3xl mx-auto">
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                                <Sparkles className="w-8 h-8 text-orange-400" />
                            </div>
                            <h3 className="text-xl font-medium text-zinc-100 mb-2">Welcome to your Symptom-Sage</h3>
                            <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
                                Tell me what you're feeling, and I'll provide an initial Vedic triage based on common patterns.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {examples.map((ex) => (
                                    <button
                                        key={ex}
                                        onClick={() => sendMessage(ex)}
                                        className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-zinc-400 hover:text-white"
                                    >
                                        {ex}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === "user"
                                            ? "bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/10"
                                            : "bg-white/10 border border-white/10 text-zinc-200"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                                        {msg.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        {isSending && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 flex gap-1">
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-white/5 border-t border-white/10">
                <div className="max-w-3xl mx-auto flex gap-3 h-12">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isSending}
                        placeholder="Type your symptoms..."
                        className="flex-1 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500/50 rounded-xl"
                    />
                    <Button
                        type="submit"
                        disabled={isSending || !input.trim()}
                        className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white shadow-lg shadow-orange-500/20 rounded-xl flex items-center justify-center shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
