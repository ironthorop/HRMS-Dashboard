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

// API call to add a new candidate
export const addCandidate = async (formData) => {
  const response = await fetch(`${BASE_API_URL}/api/candidates`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Failed to add candidate");
  }

  return await response.json();
};

// API call to update a candidate
export const updateCandidate = async (id, candidateData) => {
  const response = await fetch(`${BASE_API_URL}/api/candidates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidateData),
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Failed to update candidate");
  }

  return await response.json();
};

// API call to delete a candidate
export const deleteCandidate = async (id) => {
  const response = await fetch(`${BASE_API_URL}/api/candidates/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Failed to delete candidate");
  }

  return await response.json();
};

// API call to fetch employees
export const fetchEmployees = async () => {
  const response = await fetch(`${BASE_API_URL}/api/employees`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Failed to fetch employees");
  }

  return await response.json();
};

// Fetch all leaves
export const fetchLeaves = async () => {
  const response = await fetch(`${BASE_API_URL}/api/leaves`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Failed to fetch leaves");
  }

  return await response.json();
};

// Create a new leave
export const createLeave = async (leaveData) => {
  const response = await fetch(`${BASE_API_URL}/api/leaves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leaveData),
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Failed to create leave");
  }

  return await response.json();
};

// Update leave status
export const updateLeave = async (id, updatedData) => {
  const response = await fetch(`${BASE_API_URL}/api/leaves/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Failed to update leave");
  }

  return await response.json();
};

// Delete a leave
export const deleteLeave = async (id) => {
  const response = await fetch(`${BASE_API_URL}/api/leaves/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Failed to delete leave");
  }

  return await response.json();
};
