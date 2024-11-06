"use client";

/**
 * CompanyList Component
 * 
 * Displays a paginated list of companies with infinite scroll functionality.
 * Allows selection and deletion of multiple companies.
 * Uses Intersection Observer for infinite scroll implementation.
 */

import { FC, useEffect, useRef } from "react";
import CompanyCard from "./CompanyCard";
import Loading from "./shared/Loading";
import { useCompanies } from "../hooks/useCompanies";
import { Company } from "@/types";

const CompanyList: FC = () => {
  const {
    companies,
    isLoading,
    isError,
    selectedCompanies,
    isFetchingNextPage,
    loadNextPage,
    hasNextPage,
    toggleSelectCompany,
    deleteSelectedCompanies,
  } = useCompanies();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadNextPage, hasNextPage, isFetchingNextPage]);
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  if (isError)
    return (
      <p className="text-red-500 text-center py-4">Error loading companies.</p>
    );

  return (
    <div className="max-w-2xl mx-auto p-4 relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Company List
      </h2>
      <div className="space-y-2 mb-20">
        {companies.map((company: Company) => (
          <CompanyCard
            key={company.id}
            company={company}
            toggleSelectCompany={toggleSelectCompany}
            checked={selectedCompanies.has(company.id)}
          />
        ))}
        <div ref={loadMoreRef} className="h-10">
          {isFetchingNextPage && <Loading />}
        </div>
      </div>
      <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto">
        <button
          onClick={deleteSelectedCompanies}
          disabled={selectedCompanies.size === 0}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
        >
          Delete Selected Companies
        </button>
      </div>
    </div>
  );
};

export default CompanyList;
