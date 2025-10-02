/**
 * User List Component
 * Displays paginated list of users with CRUD operations
 */
import { useEffect, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { useCrudStore } from "../../store/crudStore";
import ConfirmationModal from "../ui/ConfirmationModal";
import { type User } from "../../types";
import Card from "../ui/Card";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";
import Alert from "../ui/Alert";
import UserCard from "./UserCard";
import UserTable from "./UserTable";
import UserModal from "./UserModal.tsx";
import FilterSort from "./FilterSort";
import ViewToggle from "./ViewToggle";

const UserList = () => {
  const {
    users,
    totalPages,
    currentPage,
    totalUsers,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    fetchUsers,
    handlePageChange,
    deleteUser,
    clearError,
  } = useUsers();

  const {
    isCreateModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    isDeleteModalOpen,
    userToDelete,
    openCreateModal,
    openEditModal,
    openViewModal,
    openDeleteModal,
    closeAllModals,
  } = useCrudStore();

  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-switch to card view on mobile
  useEffect(() => {
    if (isMobile && viewMode === "table") {
      setViewMode("card");
    }
  }, [isMobile, viewMode, setViewMode]);

  // Note: Removed useEffect that was causing page reset issues
  // The useUsers hook will handle initial data loading

  // Remove the old handlePageChange since it's now provided by useUsers hook

  const handleCreateUser = () => {
    openCreateModal();
  };

  const handleEditUser = (user: User) => {
    openEditModal(user);
  };

  const handleViewUser = (user: User) => {
    openViewModal(user);
  };

  const handleDeleteUser = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      openDeleteModal(user);
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      closeAllModals();
    }
  };

  const handleCancelDelete = () => {
    closeAllModals();
  };

  const handleModalClose = () => {
    closeAllModals();
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">
            Showing {users.length} of {totalUsers} users
            {searchTerm && ` (filtered by "${searchTerm}")`}
            {sortBy && ` (sorted by ${sortBy})`}
            <span className="ml-2 text-sm text-blue-600">
              ({viewMode === "table" ? "Table" : "Card"} view)
            </span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          <Button onClick={handleCreateUser}>Add New User</Button>
        </div>
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
          {/* Conditional rendering based on view mode */}
          {viewMode === "table" ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <UserTable
                users={users}
                onEdit={handleEditUser}
                onView={handleViewUser}
                onDelete={handleDeleteUser}
              />
            </div>
          ) : (
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
          )}

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
            <div className="flex justify-center items-center space-x-2 mt-6">
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

      {/* Create User Modal */}
      <UserModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        mode="create"
        onSuccess={handleModalSuccess}
      />

      {/* Edit User Modal */}
      <UserModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        mode="edit"
        onSuccess={handleModalSuccess}
      />

      {/* View User Modal */}
      <UserModal
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
        mode="view"
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </div>
  );
};

export default UserList;
