/**
 * User Card Component
 * Displays individual user information with action buttons
 */
import { type User } from "../../types";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserCard = ({ user, onEdit, onView, onDelete }: UserCardProps) => {
  return (
    <Card>
      <Card.Body>
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={`${user.first_name} ${user.last_name}`}
            className="h-12 w-12 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-400">ID: {user.id}</p>
          </div>
        </div>
      </Card.Body>

      <Card.Footer>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(user)}
            fullWidth
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
            fullWidth
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(user.id)}
            fullWidth
          >
            Delete
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default UserCard;
