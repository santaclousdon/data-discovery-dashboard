import { renderHook, act } from "@testing-library/react-hooks";
import { useCompanies } from "../useCompanies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

jest.mock("axios");

const queryClient = new QueryClient();
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useCompanies", () => {
  it("fetches initial data correctly", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { companies: [{ id: 1, name: "Company A" }] },
    });

    const { result, waitForNextUpdate } = renderHook(() => useCompanies(), {
      wrapper,
    });

    await waitForNextUpdate({ timeout: 3000 });

    expect(result.current.companies).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("toggles company selection", () => {
    const { result } = renderHook(() => useCompanies(), { wrapper });

    act(() => {
      result.current.toggleSelectCompany(1);
    });

    expect(result.current.selectedCompanies.has(1)).toBe(true);
  });
});
