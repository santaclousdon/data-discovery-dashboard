"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

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
