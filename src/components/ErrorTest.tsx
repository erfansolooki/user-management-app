/**
 * Error Test Component
 * Demonstrates different error scenarios for testing
 */
import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import axiosInstance from "../lib/axios";
import {
  ApiError,
  NetworkError,
  TimeoutError,
  ValidationError,
} from "../lib/errors";

const ErrorTest = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const testError = async (errorType: string) => {
    setLoading(errorType);
    try {
      switch (errorType) {
        case "401":
          await axiosInstance.get("/users/999"); // This should trigger 401
          break;
        case "404":
          await axiosInstance.get("/users/999999"); // This should trigger 404
          break;
        case "500":
          await axiosInstance.get("/users/error"); // This should trigger 500
          break;
        case "network":
          // Simulate network error by using invalid URL
          await axiosInstance.get(
            "http://invalid-url-that-does-not-exist.com/api/test"
          );
          break;
        case "timeout":
          // Simulate timeout
          await axiosInstance.get("/users", { timeout: 1 });
          break;
        case "validation":
          // Simulate validation error
          await axiosInstance.post("/users", { invalid: "data" });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Test error ${errorType}:`, error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Error Handling Test</Card.Title>
        <Card.Description>
          Test different error scenarios to see how the error handling works
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => testError("401")}
            disabled={loading === "401"}
            variant="outline"
          >
            {loading === "401" ? "Testing..." : "Test 401 (Unauthorized)"}
          </Button>

          <Button
            onClick={() => testError("404")}
            disabled={loading === "404"}
            variant="outline"
          >
            {loading === "404" ? "Testing..." : "Test 404 (Not Found)"}
          </Button>

          <Button
            onClick={() => testError("500")}
            disabled={loading === "500"}
            variant="outline"
          >
            {loading === "500" ? "Testing..." : "Test 500 (Server Error)"}
          </Button>

          <Button
            onClick={() => testError("network")}
            disabled={loading === "network"}
            variant="outline"
          >
            {loading === "network" ? "Testing..." : "Test Network Error"}
          </Button>

          <Button
            onClick={() => testError("timeout")}
            disabled={loading === "timeout"}
            variant="outline"
          >
            {loading === "timeout" ? "Testing..." : "Test Timeout Error"}
          </Button>

          <Button
            onClick={() => testError("validation")}
            disabled={loading === "validation"}
            variant="outline"
          >
            {loading === "validation" ? "Testing..." : "Test Validation Error"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ErrorTest;
