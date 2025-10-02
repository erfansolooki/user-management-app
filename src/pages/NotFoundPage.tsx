/**
 * 404 Not Found Page Component
 */
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mt-2">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/users">
            <Button>Go to Users</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
