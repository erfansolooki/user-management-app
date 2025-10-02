/**
 * Header Component
 * Application header with navigation and user menu
 */
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              User Management
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
