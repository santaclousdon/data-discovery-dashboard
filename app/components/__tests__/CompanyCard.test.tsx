import { render, screen, fireEvent } from "@testing-library/react";
import CompanyCard from "../CompanyCard";
import "@testing-library/jest-dom";

const mockToggleSelectCompany = jest.fn();

const mockCompany = {
  id: 1,
  name: "Company A",
};

describe("CompanyCard", () => {
  it("renders the company name", () => {
    render(
      <CompanyCard
        company={mockCompany}
        toggleSelectCompany={mockToggleSelectCompany}
        checked={false}
      />
    );
    expect(screen.getByText(/Company A/i)).toBeInTheDocument();
  });

  it("toggles company selection when checkbox is clicked", () => {
    render(
      <CompanyCard
        company={mockCompany}
        toggleSelectCompany={mockToggleSelectCompany}
        checked={false}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockToggleSelectCompany).toHaveBeenCalledWith(mockCompany.id);
  });
});
