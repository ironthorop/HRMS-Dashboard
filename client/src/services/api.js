const BASE_API_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:3001";

// API call for user registration
export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData), // Ensure proper JSON formatting
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Registration failed");
  }

  return await response.json();
};

// API call for user login
export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error("Unexpected server response. Please try again later.");
  }

  if (!response.ok) {
    console.error("Login failed:", responseData);
    throw new Error(responseData.message || "Login failed");
  }

  return responseData; // Ensure token and user are returned
};

// API call to verify token
export const verifyToken = async (token) => {
  const response = await fetch(`${BASE_API_URL}/api/auth/verify`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Token verification failed");
  }

  return await response.json();
};
