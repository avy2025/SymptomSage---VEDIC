import { motion } from "framer-motion";
import ChatInterface from "../components/ChatInterface";
import { Info } from "lucide-react";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-[#0d0d0d] text-white overflow-hidden selection:bg-orange-500/30">
            {/* Dynamic Vedic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-br from-orange-600/30 to-rose-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -45, 0],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-gradient-to-tl from-amber-600/20 to-orange-500/5 rounded-full blur-[100px]"
                />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col h-screen max-w-4xl">
                <header className="mb-8 text-center">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-rose-400 to-amber-400 mb-2">
                            Symptom-Sage.
                        </h1>
                        <p className="text-zinc-400 text-sm md:text-base font-light tracking-widest uppercase">
                            Powered by VEDIC Intelligence
                        </p>
                    </motion.div>
                </header>

                <section className="flex-1 min-h-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col mb-6">
                    <ChatInterface />
                </section>

                <footer className="mt-auto py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs md:text-sm">
                        <Info className="w-3 h-3" />
                        <p>
                            Informational purposes only. <strong>Not a medical diagnosis.</strong>
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
