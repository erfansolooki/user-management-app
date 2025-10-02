import React, { useState } from "react";
import FormError from "../ui/FormError";
import FormErrorCompound from "../ui/FormErrorCompound";
import Button from "../ui/Button";
import Card from "../ui/Card";

const FormErrorExample = () => {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  const triggerErrors = () => {
    setErrors({
      name: "Name is required",
      email: "Invalid email format",
      password: "Password must be at least 8 characters",
      general: "Please fix the errors above",
    });
  };

  const clearErrors = () => {
    setErrors({
      name: "",
      email: "",
      password: "",
      general: "",
    });
  };

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold text-gray-900">
          FormError Component Examples
        </h3>
        <p className="text-sm text-gray-600">
          Demonstrates different ways to use the FormError component
        </p>
      </Card.Header>

      <Card.Body className="space-y-6">
        {/* Basic Usage */}
        <div>
          <h3 className="text-lg font-medium mb-3">Basic Usage</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <FormError error={errors.name} />
          </div>
        </div>

        {/* With Icon */}
        <div>
          <h3 className="text-lg font-medium mb-3">With Icon</h3>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <FormError error={errors.email} showIcon />
          </div>
        </div>

        {/* Block Variant */}
        <div>
          <h3 className="text-lg font-medium mb-3">Block Variant</h3>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <FormError error={errors.password} variant="block" showIcon />
          </div>
        </div>

        {/* Compound Component Usage */}
        <div>
          <h3 className="text-lg font-medium mb-3">Compound Component</h3>
          <div className="space-y-2">
            <FormErrorCompound.Block error={errors.general} showIcon />
          </div>
        </div>

        {/* Custom Content */}
        <div>
          <h3 className="text-lg font-medium mb-3">Custom Content</h3>
          <FormError error="Custom error message with additional styling" />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button onClick={triggerErrors} variant="outline">
            Trigger Errors
          </Button>
          <Button onClick={clearErrors} variant="outline">
            Clear Errors
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FormErrorExample;
