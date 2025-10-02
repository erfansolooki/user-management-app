import React from "react";

interface FormErrorProps {
  error?: string;
  className?: string;
  variant?: "default" | "inline" | "block";
  showIcon?: boolean;
  children?: React.ReactNode;
}

const FormError: React.FC<FormErrorProps> & {
  Default: React.FC<FormErrorProps>;
  Inline: React.FC<FormErrorProps>;
  Block: React.FC<FormErrorProps>;
  Icon: React.FC<FormErrorProps>;
} = ({
  error,
  className = "",
  variant = "default",
  showIcon = false,
  children,
}) => {
  if (!error && !children) return null;

  const baseClasses = "text-sm text-red-600";
  const variantClasses = {
    default: "mt-1",
    inline: "ml-2",
    block: "mt-2 p-2 bg-red-50 border border-red-200 rounded-md",
  };

  const icon = showIcon ? (
    <svg
      className="inline w-4 h-4 mr-1"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ) : null;

  return (
    <p className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {icon}
      {error || children}
    </p>
  );
};

// Compound component variants
FormError.Default = ({ error, className = "", showIcon = false }) => (
  <FormError
    error={error}
    className={className}
    variant="default"
    showIcon={showIcon}
  />
);

FormError.Inline = ({ error, className = "", showIcon = false }) => (
  <FormError
    error={error}
    className={className}
    variant="inline"
    showIcon={showIcon}
  />
);

FormError.Block = ({ error, className = "", showIcon = false }) => (
  <FormError
    error={error}
    className={className}
    variant="block"
    showIcon={showIcon}
  />
);

FormError.Icon = ({ error, className = "", variant = "default" }) => (
  <FormError
    error={error}
    className={className}
    variant={variant}
    showIcon={true}
  />
);

export default FormError;
