/**
 * Card Component with compound pattern
 * Reusable card component with header, body, and footer
 */
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>
  );
};

const CardHeader = ({ children, className = "" }: CardHeaderProps) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = "" }: CardBodyProps) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = "" }: CardFooterProps) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

// Compound component pattern
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
