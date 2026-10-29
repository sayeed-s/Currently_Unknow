"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data "fresh" for 5 minutes so navigations use cache instantly
            staleTime: 1000 * 60 * 5,

            // Retain inactive cache in memory for 10 minutes
            gcTime: 1000 * 60 * 10,

            // Stop re-fetching automatically every time user switches browser tabs
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
