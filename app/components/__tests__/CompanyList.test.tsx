import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompanyList from '../CompanyList';
import { useCompanies } from '../../hooks/useCompanies';

// Mock useCompanies to control its returned state
jest.mock('../../hooks/useCompanies');
const mockedUseCompanies = useCompanies as jest.MockedFunction<typeof useCompanies>;

beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    private callback: IntersectionObserverCallback;
  
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.callback = callback;
      if (options?.root instanceof Element) this.root = options.root; // Ensure root is Element or null
      if (options?.rootMargin) this.rootMargin = options.rootMargin;
      if (options?.threshold) this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold];
    }
  
    observe = jest.fn(() => {
      // Simulate an intersecting entry
      this.callback([{ isIntersecting: true }] as IntersectionObserverEntry[], this);
    });
  
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn(() => []);
  };
});

describe('CompanyList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading spinner when loading', () => {
    mockedUseCompanies.mockReturnValue({
      companies: [],
      isLoading: true,
      isError: false,
      selectedCompanies: new Set(),
      isFetchingNextPage: false,
      loadNextPage: jest.fn(),
      hasNextPage: true,
      toggleSelectCompany: jest.fn(),
      deleteSelectedCompanies: jest.fn(),
      isFetching: false
    });

    render(<CompanyList />);

    // Check for the loading component
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    mockedUseCompanies.mockReturnValue({
      companies: [],
      isLoading: false,
      isError: true,
      selectedCompanies: new Set(),
      isFetchingNextPage: false,
      loadNextPage: jest.fn(),
      hasNextPage: false,
      toggleSelectCompany: jest.fn(),
      deleteSelectedCompanies: jest.fn(),
      isFetching: false
    });

    render(<CompanyList />);

    // Check for the error message
    expect(screen.getByText(/Error loading companies/i)).toBeInTheDocument();
  });

  it('renders companies when data is available', () => {
    mockedUseCompanies.mockReturnValue({
      companies: [
        { id: 1, name: 'Company A' },
        { id: 2, name: 'Company B' },
      ],
      isLoading: false,
      isError: false,
      selectedCompanies: new Set(),
      isFetchingNextPage: false,
      loadNextPage: jest.fn(),
      hasNextPage: true,
      toggleSelectCompany: jest.fn(),
      deleteSelectedCompanies: jest.fn(),
      isFetching: false
    });

    render(<CompanyList />);

    // Check for the rendered companies
    expect(screen.getByText(/Company A/i)).toBeInTheDocument();
    expect(screen.getByText(/Company B/i)).toBeInTheDocument();
  });

  it('calls loadNextPage when the user scrolls to the bottom', () => {
    const loadNextPageMock = jest.fn();

    mockedUseCompanies.mockReturnValue({
      companies: [{ id: 1, name: 'Company A' }],
      isLoading: false,
      isError: false,
      selectedCompanies: new Set(),
      isFetchingNextPage: false,
      loadNextPage: loadNextPageMock,
      hasNextPage: true,
      toggleSelectCompany: jest.fn(),
      deleteSelectedCompanies: jest.fn(),
      isFetching: false,
    });

    render(<CompanyList />);

    // Immediately check if loadNextPage has been called after render
    expect(loadNextPageMock).toHaveBeenCalled();
  });

  it('calls toggleSelectCompany when a company card is clicked', () => {
    const toggleSelectCompanyMock = jest.fn();

    mockedUseCompanies.mockReturnValue({
      companies: [{ id: 1, name: 'Company A' }],
      isLoading: false,
      isError: false,
      selectedCompanies: new Set(),
      isFetchingNextPage: false,
      loadNextPage: jest.fn(),
      hasNextPage: true,
      toggleSelectCompany: toggleSelectCompanyMock,
      deleteSelectedCompanies: jest.fn(),
      isFetching: false
    });

    render(<CompanyList />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Check if toggleSelectCompany has been called with the correct ID
    expect(toggleSelectCompanyMock).toHaveBeenCalledWith(1);
  });

  it('disables delete button when no companies are selected', () => {
    mockedUseCompanies.mockReturnValue({
      companies: [{ id: 1, name: 'Company A' }],
      isLoading: false,
      isError: false,
      selectedCompanies: new Set(),
      isFetchingNextPage: false,
      loadNextPage: jest.fn(),
      hasNextPage: true,
      toggleSelectCompany: jest.fn(),
      deleteSelectedCompanies: jest.fn(),
      isFetching: false
    });

    render(<CompanyList />);

    const deleteButton = screen.getByRole('button', { name: /Delete Selected Companies/i });
    expect(deleteButton).toBeDisabled();
  });

  it('enables delete button when a company is selected', () => {
    mockedUseCompanies.mockReturnValue({
      companies: [{ id: 1, name: 'Company A' }],
      isLoading: false,
      isError: false,
      selectedCompanies: new Set([1]),
      isFetchingNextPage: false,
      loadNextPage: jest.fn(),
      hasNextPage: true,
      toggleSelectCompany: jest.fn(),
      deleteSelectedCompanies: jest.fn(),
      isFetching: false
    });

    render(<CompanyList />);

    const deleteButton = screen.getByRole('button', { name: /Delete Selected Companies/i });
    expect(deleteButton).not.toBeDisabled();
  });

  it('calls deleteSelectedCompanies when the delete button is clicked', () => {
    const deleteSelectedCompaniesMock = jest.fn();

    mockedUseCompanies.mockReturnValue({
      companies: [{ id: 1, name: 'Company A' }],
      isLoading: false,
      isError: false,
      selectedCompanies: new Set([1]),
      isFetchingNextPage: false,
      loadNextPage: jest.fn(),
      hasNextPage: true,
      toggleSelectCompany: jest.fn(),
      deleteSelectedCompanies: deleteSelectedCompaniesMock,
      isFetching: false
    });

    render(<CompanyList />);

    const deleteButton = screen.getByRole('button', { name: /Delete Selected Companies/i });
    fireEvent.click(deleteButton);

    expect(deleteSelectedCompaniesMock).toHaveBeenCalled();
  });
});
