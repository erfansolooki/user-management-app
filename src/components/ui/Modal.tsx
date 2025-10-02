/**
 * Modal Component with compound pattern
 * Reusable modal component with header, body, and footer
 */
import { type ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

interface ModalHeaderProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

const Modal = ({ isOpen, onClose, children, size = "md" }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div
          className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const ModalHeader = ({
  children,
  onClose,
  className = "",
}: ModalHeaderProps) => {
  return (
    <div
      className={`flex items-center justify-between p-6 border-b border-gray-200 ${className}`}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const ModalBody = ({ children, className = "" }: ModalBodyProps) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

const ModalFooter = ({ children, className = "" }: ModalFooterProps) => {
  return (
    <div
      className={`flex items-center justify-end space-x-3 p-6 border-t border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

// Compound component pattern
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
