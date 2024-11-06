"use client"

import CompanyList from "./components/CompanyList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <CompanyList />
    </QueryClientProvider>
  );
}
