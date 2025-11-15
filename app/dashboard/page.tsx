"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Resource } from "../home/page";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Cell,
  PieChart,
  Pie,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [sum, setSum] = useState<number>(0);
  const [salary, setSalary] = useState<number>(0);
  const [seeCharts, setSeeCharts] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  const totalIncome = resources
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = resources
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0);

  const calculateSum = (resources: Resource[]) => {
    const totalExpenses = resources
      .filter((r) => r.type === "expense")
      .reduce((acc, r) => acc + r.amount, 0);
    const totalIncome = resources
      .filter((r) => r.type === "income")
      .reduce((acc, r) => acc + r.amount, 0);

    setSum(totalExpenses);
    setSalary(totalIncome);
  };

  const handleToggle = () => {
    localStorage.setItem("seeCharts", JSON.stringify(!seeCharts));
    setSeeCharts(!seeCharts);
  };
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setLoggedIn(false);
    router.push("/");
  };
  useEffect(() => {
    const storedSeeCharts = localStorage.getItem("seeCharts");
    if (storedSeeCharts) setSeeCharts(JSON.parse(storedSeeCharts));

    const storedResources = localStorage.getItem("resources");
    if (storedResources) setResources(JSON.parse(storedResources));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("resources");
    if (stored) setResources(JSON.parse(stored));
  }, []);

  useEffect(() => {
    calculateSum(resources);
  }, [resources]);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedLoggedIn !== "true") {
      router.push("/");
    } else {
      setLoggedIn(true);
    }
  }, [router]);

  return (
    <div
      style={{
        backgroundColor: "#0F172A",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "1.5rem",
        gap: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#1E293B",
          width: "100%",
          marginTop: "5vh",
          maxWidth: "800px",
          height: "auto",
          minHeight: "auto",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            backgroundColor: "#111827",
            padding: "1rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#F1F5F9",
          }}
        >
          <button
            style={{
              backgroundColor: "#334155",
              border: "none",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => handleLogout()}
          >
            Logout
          </button>

          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Dashboard</h1>

          <button
            style={{
              backgroundColor: "#10B981",
              border: "none",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => router.push("/home")}
          >
            Home
          </button>
        </header>

        {/* MAIN CONTENT */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem 1.5rem",
            gap: "1.5rem",
            overflowY: "auto",
            height: "100%",
          }}
        >
          {/* RESOURCE LIST */}
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            <button
              style={{ maxWidth: "150px", background: "#334155" }}
              onClick={() => handleToggle()}
            >
              See Diagrams
            </button>
            {resources.map((r, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#334155",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#F1F5F9",
                }}
              >
                <p
                  style={{
                    color:
                      r.type === "expense"
                        ? "rgba(255, 142, 142)"
                        : "rgba(115, 182, 106)",
                    margin: 0,
                  }}
                >
                  {r.name}: {r.amount}€, {r.category}
                </p>
              </div>
            ))}
          </div>

          {/* Restgehalt am unteren Rand */}
          <p
            style={{
              backgroundColor: "#334155",
              padding: "0.5rem 1rem",

              borderRadius: "6px",
              color:
                salary - sum > 0
                  ? "rgba(115, 182, 106, 1)"
                  : "rgba(255, 142, 142, 1)",

              maxWidth: "600px",
              textAlign: "right",
            }}
          >
            Restgehalt: {salary - sum}€
          </p>
        </main>
      </div>
      {seeCharts && (
        <>
          <div
            style={{
              backgroundColor: "#1E293B",
              width: "100%",
              maxWidth: "800px",
              minHeight: "200px",
              borderRadius: "12px",
              boxShadow: "0 0 15px rgba(0,0,0,0.4)",
              color: "#F1F5F9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem",
            }}
          >
            <BarChart
              width={400}
              height={300}
              data={[
                { name: "Income", amount: totalIncome },
                { name: "Expense", amount: totalExpense },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="amount" fill="#10B981">
                <Cell fill="rgba(115, 182, 106, 1)" />
                <Cell fill="rgba(255, 142, 142, 1)" />
              </Bar>
            </BarChart>
          </div>
          <div
            style={{
              backgroundColor: "#1E293B",
              width: "100%",
              maxWidth: "800px",
              minHeight: "200px",
              borderRadius: "12px",
              boxShadow: "0 0 15px rgba(0,0,0,0.4)",
              color: "#F1F5F9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem",
            }}
          >
            <PieChart width={400} height={300}>
              <Pie
                data={resources}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent! * 100).toFixed(0)}%`
                }
              >
                {resources.map((r, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      r.type === "expense"
                        ? "rgba(255, 142, 142, 1)"
                        : "rgba(115, 182, 106, 1)"
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </>
      )}
    </div>
  );
}
