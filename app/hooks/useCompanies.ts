"use client";

/**
 * useCompanies Hook
 * 
 * Manages company data fetching, pagination, and selection state.
 * Provides functionality for:
 * - Infinite scrolling with React Query
 * - Company selection management
 * - Batch deletion of selected companies
 */

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetches paginated company data from the API
 * @param page - The page number to fetch
 * @param pageSize - Number of companies per page, defaults to 15
 * @returns Paginated company data with metadata
 */
const fetchCompanies = async (page: number, pageSize = 15) => {
  const { data } = await axios.get(
    `/api/companies?page=${page}&pageSize=${pageSize}`
  );
  return data;
};

export const useCompanies = () => {
  const [selectedCompanies, setSelectedCompanies] = useState<Set<number>>(
    new Set()
  );
  const {
    data,
    isLoading,
    isError,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["companies"],
    queryFn: ({ pageParam }) => fetchCompanies(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore && lastPage.companies.length > 0) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const companies = data?.pages.flatMap((page) => page.companies) ?? [];

  /**
   * Toggles the selection state of a company
   * @param id - The ID of the company to toggle
   */
  const toggleSelectCompany = (id: number) => {
    setSelectedCompanies((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(id)) {
        updatedSelected.delete(id);
      } else {
        updatedSelected.add(id);
      }
      return updatedSelected;
    });
  };

  /**
   * Handles the deletion of selected companies
   * Shows confirmation dialog with company names
   * Clears selection after confirmation
   */
  const deleteSelectedCompanies = () => {
    const companiNames = Array.from(selectedCompanies).map(
      (id) => companies.find((company) => company.id === id)?.name
    );
    const confirmed = window.confirm(
      `Are you sure you want to delete these ${companiNames.join(
        ", "
      )} companies?`
    );
    if (confirmed) {
      setSelectedCompanies(new Set());
    }
  };

  /**
   * Triggers loading of the next page of companies
   * Only loads if there are more pages available
   */
  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    companies,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetching: isFetching,
    hasNextPage,
    selectedCompanies,
    toggleSelectCompany,
    deleteSelectedCompanies,
    loadNextPage,
  };
};
