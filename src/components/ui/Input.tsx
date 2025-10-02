/**
 * Input Component with compound pattern
 * Reusable input component with validation states
 */
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, fullWidth = false, className = "", ...props },
    ref
  ) => {
    const baseClasses =
      "block w-full px-4 py-3 rounded-lg border-2 border-gray-200 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none sm:text-sm placeholder-gray-400";
    const errorClasses = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
      : "";
    const widthClasses = fullWidth ? "w-full" : "";

    const inputClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${className}`;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
