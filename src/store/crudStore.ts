/**
 * CRUD Store for User Management
 * Manages local state for user operations without unnecessary API calls
 */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type User } from "../types";

interface CrudState {
  // Current user being edited/viewed
  selectedUser: User | null;

  // CRUD operations state
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isViewModalOpen: boolean;
  isDeleteModalOpen: boolean;

  // User to delete
  userToDelete: User | null;

  // Actions
  setSelectedUser: (user: User | null) => void;
  openCreateModal: () => void;
  openEditModal: (user: User) => void;
  openViewModal: (user: User) => void;
  openDeleteModal: (user: User) => void;
  closeAllModals: () => void;
  setUserToDelete: (user: User | null) => void;
}

export const useCrudStore = create<CrudState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedUser: null,
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isViewModalOpen: false,
      isDeleteModalOpen: false,
      userToDelete: null,

      // Actions
      setSelectedUser: (user) => set({ selectedUser: user }),

      openCreateModal: () =>
        set({
          isCreateModalOpen: true,
          isEditModalOpen: false,
          isViewModalOpen: false,
          isDeleteModalOpen: false,
          selectedUser: null,
        }),

      openEditModal: (user) =>
        set({
          isEditModalOpen: true,
          isCreateModalOpen: false,
          isViewModalOpen: false,
          isDeleteModalOpen: false,
          selectedUser: user,
        }),

      openViewModal: (user) =>
        set({
          isViewModalOpen: true,
          isCreateModalOpen: false,
          isEditModalOpen: false,
          isDeleteModalOpen: false,
          selectedUser: user,
        }),

      openDeleteModal: (user) =>
        set({
          isDeleteModalOpen: true,
          isCreateModalOpen: false,
          isEditModalOpen: false,
          isViewModalOpen: false,
          selectedUser: null,
          userToDelete: user,
        }),

      closeAllModals: () =>
        set({
          isCreateModalOpen: false,
          isEditModalOpen: false,
          isViewModalOpen: false,
          isDeleteModalOpen: false,
          selectedUser: null,
          userToDelete: null,
        }),

      setUserToDelete: (user) => set({ userToDelete: user }),
    }),
    {
      name: "crud-store",
    }
  )
);
