/**
 * CheckBox Component
 * 
 * A reusable checkbox component with custom styling.
 * Features animated check mark and purple accent colors.
 */

import React from "react";

type CheckBoxProps = {
  checked: boolean;
  onChange: () => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange()}
        className="sr-only peer"
      />
      <div className="w-6 h-6 border-2 border-purple-300 rounded-md peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all duration-200 flex items-center justify-center">
        <svg
          className={`w-4 h-4 text-white ${
            checked ? "opacity-100" : "opacity-0"
          } transition-opacity duration-200`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </label>
  );
};

export default CheckBox;
