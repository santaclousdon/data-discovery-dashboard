"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CompanyList from "./components/CompanyList";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <CompanyList />
    </QueryClientProvider>
  );
}
