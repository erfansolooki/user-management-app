/**
 * User Modal Component
 * Handles user creation, editing, and viewing
 */
import { useState, useEffect } from "react";
import { type User } from "../../types";
import { useUsers, useUser } from "../../hooks/useUsers";
import { useFormValidation } from "../../hooks/useFormValidation";
import { type ValidationRules } from "../../types";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";
import LoadingSpinner from "../ui/LoadingSpinner";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  mode: "create" | "edit" | "view";
  onSuccess: () => void;
}

const UserModal = ({
  isOpen,
  onClose,
  user,
  mode,
  onSuccess,
}: UserModalProps) => {
  const { createUser, updateUser } = useUsers();
  const { currentUser, isLoading, error } = useUser(user?.id || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules: ValidationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    job: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormValidation({
    initialValues: {
      name: "",
      job: "",
    },
    validationRules,
    onSubmit: async (formValues) => {
      setIsSubmitting(true);

      try {
        if (mode === "create") {
          const result = await createUser(
            formValues as { name: string; job: string }
          );
          if (result.success) {
            onSuccess();
          } else {
            alert(result.error);
          }
        } else if (mode === "edit" && currentUser) {
          const result = await updateUser(
            currentUser.id,
            formValues as { name?: string; job?: string }
          );
          if (result.success) {
            onSuccess();
          } else {
            alert(result.error);
          }
        }
      } catch (error) {
        console.error("Modal submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Set form values when user data is loaded
  useEffect(() => {
    if (currentUser && (mode === "edit" || mode === "view")) {
      setFieldValue(
        "name",
        `${currentUser.first_name} ${currentUser.last_name}`
      );
      setFieldValue("job", "Software Engineer"); // Default job since API doesn't provide it
    } else if (mode === "create") {
      resetForm();
    }
  }, [currentUser, mode, setFieldValue, resetForm]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isReadOnly = mode === "view";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <Modal.Header onClose={handleClose}>
        <h2 className="text-lg font-medium text-gray-900">
          {mode === "create" && "Create New User"}
          {mode === "edit" && "Edit User"}
          {mode === "view" && "User Details"}
        </h2>
      </Modal.Header>

      <Modal.Body>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="error">
                <Alert.Description>{error}</Alert.Description>
              </Alert>
            )}

            {currentUser && (
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={currentUser.avatar}
                  alt={`${currentUser.first_name} ${currentUser.last_name}`}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {currentUser.first_name} {currentUser.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
            )}

            <div>
              <Input
                label="Name"
                name="name"
                value={values.name as string}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                error={errors.name}
                disabled={isReadOnly}
                fullWidth
                placeholder="Enter full name"
              />
            </div>

            <div>
              <Input
                label="Job"
                name="job"
                value={values.job as string}
                onChange={(e) => handleChange("job", e.target.value)}
                onBlur={() => handleBlur("job")}
                error={errors.job}
                disabled={isReadOnly}
                fullWidth
                placeholder="Enter job title"
              />
            </div>

            {!isReadOnly && (
              <Modal.Footer>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {mode === "create" ? "Create User" : "Update User"}
                </Button>
              </Modal.Footer>
            )}

            {isReadOnly && (
              <Modal.Footer>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            )}
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UserModal;
