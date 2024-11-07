/**
 * CompanyCard Component
 *
 * Renders an individual company card with selection functionality.
 * Displays company name and provides checkbox interaction.
 */

import React from "react";
import CheckBox from "./shared/CheckBox";
import { Company } from "@/types";

type CompanyCardProps = {
  company: Company;
  toggleSelectCompany: (companyId: number) => void;
  checked: boolean;
};

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  toggleSelectCompany,
  checked,
}) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white rounded-xl border border-purple-200 transition-all duration-300 shadow-sm hover:shadow-lg group">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
          <span className="text-lg font-semibold text-purple-600">
            {company.name.split(" ")[1]}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-800 font-semibold group-hover:text-purple-600 transition-colors">
            {company.name}
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <CheckBox
          checked={checked}
          onChange={() => toggleSelectCompany(company.id)}
        />
      </div>
    </div>
  );
};

export default CompanyCard;
