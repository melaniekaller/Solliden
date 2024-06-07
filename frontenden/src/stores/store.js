import { create } from "zustand";

const loadInitialState = () => {
  const token = localStorage.getItem("token") || null;
  const userData = JSON.parse(localStorage.getItem("userData")) || null;

  // Attempt to parse the user data from localStorage or set to null if not found
  return { token: token, userData };
};

const useAuthStore = create((set, get) => ({
  ...loadInitialState(),
  setToken: (token) => {
    localStorage.setItem("token", token); // Save the token to localStorage
    set(() => ({ token }));
  },
  logout: () => {
    localStorage.removeItem("token"); // Ensure to clear all localStorage on logout
    set(() => ({ token: null }));
  },
  setUserData: (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData)); // Save the user data to localStorage
    set(() => ({ userData }));
  },
  fetchUser: async () => {
    const { token, logout, setUserData } = get(); // Accessing current state and actions
    try {
      const response = await fetch("http://localhost:8000/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const userData = await response.json();
        setUserData(userData);
      } else if (response.status === 401) {
        logout();
        // You might need to handle navigation to /login outside this store, as Zustand doesn't manage routing
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("There was an error fetching user data:", error);
      // Handle error as needed
    }
  },
}));

export default useAuthStore;
