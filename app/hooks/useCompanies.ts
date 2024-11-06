"use client";

import axios from "axios";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchCompanies = async (page: number) => {
  const { data } = await axios.get(`/api/companies?page=${page}&pageSize=15`);
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
      return undefined; // Returning undefined signals there's no next page
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
    console.log("Deleting data for companies:", Array.from(selectedCompanies));
    setSelectedCompanies(new Set());
  };

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  console.log(companies);

  return {
    companies,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetching: isFetching || isFetchingNextPage,
    hasNextPage,
    selectedCompanies,
    toggleSelectCompany,
    deleteSelectedCompanies,
    loadNextPage,
  };
};
