import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="pt-6">
                    <div className="flex mb-4 gap-2">
                        <AlertCircle className="h-8 w-8 text-rose-500" />
                        <h1 className="text-2xl font-bold text-white">404 Page Not Found</h1>
                    </div>

                    <p className="mt-4 text-sm text-zinc-400">
                        Did you take a wrong turn? The page you're looking for doesn't exist.
                    </p>

                    <Link href="/" className="inline-block mt-6 text-orange-400 hover:text-orange-300 transition-colors">
                        Return to Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
