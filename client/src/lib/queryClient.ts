import { QueryClient, QueryFunction } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey }) => {
                const res = await fetch(queryKey[0] as string);
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            },
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

export const apiRequest = async (
    method: string,
    url: string,
    data?: unknown
) => {
    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorBody.message || "API request failed");
    }

    if (res.status === 204) return null;
    return res.json();
};
