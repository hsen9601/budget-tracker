"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();

  // Toggle to show credentials
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("isOpen");
    return stored ? JSON.parse(stored) : false;
  });

  const [mockUpUser] = useState<User>({
    username: "admin",
    password: "pass",
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users (optional)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await fetch("/api/users");
        const data = await resp.json();
        setUsers(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUsers();
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => {
      localStorage.setItem("isOpen", JSON.stringify(!prev));
      return !prev;
    });
  };

  const handleLogin = (username: string, password: string) => {
    const matchedUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (
      matchedUser ||
      (username === mockUpUser.username && password === mockUpUser.password)
    ) {
      localStorage.setItem("isLoggedIn", "true");

      // Initialize mockup data for recruiter
      if (mockUpUser && !localStorage.getItem("resources")) {
        const mockResources = [
          {
            name: "Salary",
            amount: 4000,
            category: "Lohn/Gehalt",
            type: "income",
          },
          { name: "Rent", amount: 1200, category: "Wohnen", type: "expense" },
          {
            name: "Groceries",
            amount: 300,
            category: "Lebensmittel",
            type: "expense",
          },
          {
            name: "Internet",
            amount: 50,
            category: "Internet",
            type: "expense",
          },
        ];
        localStorage.setItem("resources", JSON.stringify(mockResources));
      }

      router.push("/home");
    } else {
      alert("Credentials were wrong");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0F172A",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "inherit",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#1E293B",
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 0 25px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5vh",
          gap: "1.2rem",
          maxHeight: "500px",
        }}
      >
        <h1
          style={{ color: "#F1F5F9", fontSize: "1.8rem", fontWeight: "bold" }}
        >
          Login
        </h1>

        {/* Username Input */}
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <label style={{ color: "#CBD5E1", marginBottom: "0.3rem" }}>
            Username
          </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            value={username}
            style={{
              padding: "0.6rem",
              borderRadius: "6px",
              border: "1px solid #475569",
              backgroundColor: "#334155",
              color: "#F1F5F9",
              outline: "none",
            }}
          />
        </div>

        {/* Password Input */}
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <label style={{ color: "#CBD5E1", marginBottom: "0.3rem" }}>
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="pass"
            type="password"
            value={password}
            style={{
              padding: "0.6rem",
              borderRadius: "6px",
              border: "1px solid #475569",
              backgroundColor: "#334155",
              color: "#F1F5F9",
              outline: "none",
            }}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={() => handleLogin(username, password)}
          style={{
            marginTop: "0.5rem",
            width: "100%",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "0.8rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          Login
        </button>

        {/* Toggle Credentials */}
        <button
          style={{
            marginTop: "0.5rem",

            backgroundColor: "#288880ff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "0.8rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onClick={() => handleToggle()}
        >
          See Credentials
        </button>

        {isOpen && (
          <p style={{ color: "white" }}>
            Username: {mockUpUser.username}; Password: {mockUpUser.password}
          </p>
        )}
      </div>
    </div>
  );
}
