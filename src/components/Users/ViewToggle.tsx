import { useState, useEffect } from "react";

interface ViewToggleProps {
  currentView: "table" | "card";
  onViewChange: (view: "table" | "card") => void;
}

const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // On mobile, always show card view
  useEffect(() => {
    if (isMobile && currentView === "table") {
      onViewChange("card");
    }
  }, [isMobile, currentView, onViewChange]);

  // Disable table view on mobile
  const handleViewChange = (view: "table" | "card") => {
    if (isMobile && view === "table") {
      return; // Don't allow table view on mobile
    }
    onViewChange(view);
  };

  if (isMobile) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Mobile View</span>
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            className={`p-2 rounded-md transition-colors ${
              currentView === "card"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleViewChange("card")}
            title="Card View"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">View:</span>
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          className={`p-2 rounded-md transition-colors ${
            currentView === "table"
              ? "bg-white shadow-sm text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleViewChange("table")}
          title="Table View"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </button>
        <button
          className={`p-2 rounded-md transition-colors ${
            currentView === "card"
              ? "bg-white shadow-sm text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleViewChange("card")}
          title="Card View"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
