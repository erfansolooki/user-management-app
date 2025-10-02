/**
 * User List Component
 * Displays paginated list of users with CRUD operations
 */
import { useEffect, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { type User } from "../../types";
import Card from "../ui/Card";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";
import Alert from "../ui/Alert";
import UserCard from "./UserCard";
import UserModal from "./UserModal.tsx";
import FilterSort from "./FilterSort";

const UserList = () => {
  const {
    users,
    originalUsers,
    totalPages,
    currentPage,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    fetchUsers,
    deleteUser,
    clearError,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "view"
  );

  useEffect(() => {
    fetchUsers({ page: 1 });
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    fetchUsers({ page });
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    // Just refresh the current page (less aggressive)
    fetchUsers({ page: currentPage });
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="error">
          <Alert.Description>{error}</Alert.Description>
        </Alert>
        <Button
          onClick={() => {
            clearError();
            fetchUsers({ page: 1 });
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">
            Showing {users.length} of {originalUsers.length} users
            {searchTerm && ` (filtered by "${searchTerm}")`}
            {sortBy && ` (sorted by ${sortBy})`}
          </p>
        </div>
        <Button onClick={handleCreateUser}>Add New User</Button>
      </div>

      {/* Filter and Sort Controls */}
      <FilterSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEditUser}
                onView={handleViewUser}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>

          {users.length === 0 && (
            <Card>
              <Card.Body className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm || sortBy
                    ? "No users match your current filter/sort criteria."
                    : "No users found."}
                </p>
                {(searchTerm || sortBy) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSortBy("");
                      setSortOrder("asc");
                    }}
                    className="mt-2"
                  >
                    Clear Filters
                  </Button>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
        mode={modalMode}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default UserList;
