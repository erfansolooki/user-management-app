/**
 * Generic form validation hook
 * Provides reusable form validation logic
 */
import { useState, useCallback } from "react";
import { type ValidationRules, type FormErrors } from "../types";

interface UseFormValidationOptions {
  initialValues: Record<string, unknown>;
  validationRules: ValidationRules;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
}

export const useFormValidation = ({
  initialValues,
  validationRules,
  onSubmit,
}: UseFormValidationOptions) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (name: string, value: unknown): string | null => {
      const rules = validationRules[name];
      if (!rules) return null;

      // Required validation
      if (
        rules.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        return `${name} is required`;
      }

      // Skip other validations if field is empty and not required
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return null;
      }

      // Min length validation
      if (
        rules.minLength &&
        typeof value === "string" &&
        value.length < rules.minLength
      ) {
        return `${name} must be at least ${rules.minLength} characters`;
      }

      // Max length validation
      if (
        rules.maxLength &&
        typeof value === "string" &&
        value.length > rules.maxLength
      ) {
        return `${name} must be no more than ${rules.maxLength} characters`;
      }

      // Pattern validation
      if (
        rules.pattern &&
        typeof value === "string" &&
        !rules.pattern.test(value)
      ) {
        return `${name} format is invalid`;
      }

      // Custom validation
      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [validationRules]
  );

  /**
   * Validate all fields
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  /**
   * Handle input change
   */
  const handleChange = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    setErrors((prev) => {
      if (prev[name]) {
        return { ...prev, [name]: null };
      }
      return prev;
    });
  }, []);

  /**
   * Handle input blur with validation
   */
  const handleBlur = useCallback(
    (name: string) => {
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [values, validateField]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set a specific field value
   */
  const setFieldValue = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Set a specific field error
   */
  const setFieldError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    clearErrors,
    validateField,
    validateForm,
  };
};
