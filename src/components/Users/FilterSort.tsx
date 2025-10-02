import { type User } from "../../types";

interface FilterSortProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: keyof User | "";
  onSortChange: (field: keyof User | "") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
}

const FilterSort = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: FilterSortProps) => {
  const sortOptions = [
    { value: "", label: "No sorting" },
    { value: "first_name", label: "First Name" },
    { value: "last_name", label: "Last Name" },
    { value: "email", label: "Email" },
    { value: "id", label: "ID" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Users
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Sort By */}
        <div className="sm:w-48">
          <label
            htmlFor="sortBy"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as keyof User | "")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="sm:w-32">
          <label
            htmlFor="sortOrder"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Order
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) =>
              onSortOrderChange(e.target.value as "asc" | "desc")
            }
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => {
              onSearchChange("");
              onSortChange("");
              onSortOrderChange("asc");
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || sortBy) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange("")}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
              >
                <span className="sr-only">Remove</span>
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                  <path d="M5.5 4L8 6.5 6.5 8 4 5.5 1.5 8 0 6.5 2.5 4 0 1.5 1.5 0 4 2.5 6.5 0 8 1.5 5.5 4z" />
                </svg>
              </button>
            </span>
          )}
          {sortBy && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label} (
              {sortOrder})
              <button
                onClick={() => onSortChange("")}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
              >
                <span className="sr-only">Remove</span>
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                  <path d="M5.5 4L8 6.5 6.5 8 4 5.5 1.5 8 0 6.5 2.5 4 0 1.5 1.5 0 4 2.5 6.5 0 8 1.5 5.5 4z" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSort;
