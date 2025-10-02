import React, { useState } from "react";

interface UserAvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt,
  size = "md",
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-base",
    md: "h-10 w-10 text-lg",
    lg: "h-12 w-12 text-xl",
    xl: "h-16 w-16 text-2xl",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!src || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center ${className}`}
        aria-label={alt}
      >
        <svg
          className={`${iconSizeClasses[size]} text-gray-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={handleImageError}
    />
  );
};

export default UserAvatar;
