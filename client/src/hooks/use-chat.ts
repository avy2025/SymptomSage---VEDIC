import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient";
import { nanoid } from "nanoid/non-secure";
import { useEffect, useState } from "react";
import type { Message } from "../../../shared/schema";

export function useChat() {
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        let id = localStorage.getItem("vedic_session_id");
        if (!id) {
            id = nanoid();
            localStorage.setItem("vedic_session_id", id);
        }
        setSessionId(id);
    }, []);

    const { data: messages = [], isLoading } = useQuery<Message[]>({
        queryKey: [`/api/chat/${sessionId}`],
        enabled: !!sessionId,
    });

    const sendMessageMutation = useMutation({
        mutationFn: async (message: string) => {
            return await apiRequest("POST", "/api/chat", {
                message,
                sessionId,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/chat/${sessionId}`] });
        },
    });

    const clearChatMutation = useMutation({
        mutationFn: async () => {
            await apiRequest("DELETE", `/api/chat/${sessionId}`);
        },
        onSuccess: () => {
            queryClient.setQueryData([`/api/chat/${sessionId}`], []);
        },
    });

    return {
        messages,
        isLoading,
        sendMessage: sendMessageMutation.mutate,
        isSending: sendMessageMutation.isPending,
        clearChat: clearChatMutation.mutate,
        isClearing: clearChatMutation.isPending,
    };
}
