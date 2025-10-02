/**
 * Login Form Component
 * Handles user authentication
 */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFormValidation } from "../../hooks/useFormValidation";
import { type ValidationRules } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import Alert from "../ui/Alert";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules: ValidationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 6,
    },
  };

  const { values, errors, handleChange, handleBlur, handleSubmit } =
    useFormValidation({
      initialValues: {
        email: "",
        password: "",
      },
      validationRules,
      onSubmit: async (formValues) => {
        setIsSubmitting(true);
        clearError();

        const result = await login({
          email: formValues.email as string,
          password: formValues.password as string,
        });

        if (result.success) {
          const from = location.state?.from?.pathname || "/users";
          navigate(from, { replace: true });
        }

        setIsSubmitting(false);
      },
    });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use any email and password to login (demo mode)
          </p>
        </div>

        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="error">
                  <Alert.Description>{error}</Alert.Description>
                </Alert>
              )}

              <div>
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  value={values.email as string}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  error={errors.email}
                  fullWidth
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={values.password as string}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  error={errors.password}
                  fullWidth
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
