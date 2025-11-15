"use client";

import { Flamenco } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  username: string;
  password: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [mockUpUser, setMockUpUser] = useState<User>();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const resp = await fetch("/api/users");
      const data = await resp.json();
      setUsers(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleToggle = () => {
    localStorage.setItem("isOpen", JSON.stringify(!isOpen));
    setIsOpen(!isOpen);
  };
  const handleLogin = (username: string, password: string) => {
    const matchedUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (matchedUser) {
      console.log("The credentials were correct!", matchedUser);
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      router.push("/home");
    } else if (
      username == mockUpUser?.username &&
      password == mockUpUser.password
    ) {
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      router.push("/home");
    } else {
      alert("Credentials were wrong");
    }
  };

  useEffect(() => {
    fetchUsers();
    const stored = localStorage.getItem("isOpen");
    if (stored) setIsOpen(JSON.parse(stored));
    setMockUpUser({ username: "admin", password: "pass" });
  }, []);

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
        }}
      >
        <h1
          style={{ color: "#F1F5F9", fontSize: "1.8rem", fontWeight: "bold" }}
        >
          Login
        </h1>

        {/* USERNAME INPUT */}
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <label style={{ color: "#CBD5E1", marginBottom: "0.3rem" }}>
            Username
          </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
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

        {/* PASSWORD INPUT */}
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <label style={{ color: "#CBD5E1", marginBottom: "0.3rem" }}>
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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

        {/* LOGIN BUTTON */}
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
        <button style={{ background: "green" }} onClick={() => handleToggle()}>
          See Credentials
        </button>
        {isOpen && (
          <p>
            Username: {mockUpUser?.username}; Password: {mockUpUser?.password}
          </p>
        )}
      </div>
    </div>
  );
}
