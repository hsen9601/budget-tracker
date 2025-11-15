"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Resource = {
  name: string;
  amount: number;
  category: string;
  type: string;
};

export default function Home() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [resource, setResource] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [type, setType] = useState<string>("expense");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const categoryOptions = [
    "Lebensmittel",
    "Lohn/Gehalt",
    "Abo",
    "Wohnen",
    "Hobbys",
    "Mobilität",
    "Tierhaltung",
    "Versicherung",
    "Internet",
  ];
  const [category, setCategory] = useState<string>(categoryOptions[0]);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setLoggedIn(false);
    router.push("/");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(categoryOptions);
      const storage = localStorage.getItem("resources");
      if (storage) setResources(JSON.parse(storage));
      setHasLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedLoggedIn = localStorage.getItem("isLoggedIn");
      if (storedLoggedIn !== "true") {
        router.push("/");
      } else {
        setLoggedIn(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (hasLoaded) {
      const timer = setTimeout(() => {
        localStorage.setItem("resources", JSON.stringify(resources));
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [resources, hasLoaded]);

  const handleAdd = (
    name: string,
    amount: number,
    category: string,
    type: string
  ) => {
    if (!name || !amount) return;
    setResources((prev) => [...prev, { name, amount, category, type }]);
    setAmount(0);
    setResource("");
  };

  const handleDelete = (index: number) => {
    const newResources = resources.filter((_, i) => i !== index);
    setResources(newResources);
  };

  return (
    <>
      {loggedIn == true && (
        <div
          style={{
            backgroundColor: "#0F172A",
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "inherit",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#1E293B",
              marginTop: "5vh",
              width: "100%",
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

              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Home</h1>

              <button
                style={{
                  backgroundColor: "#10B981",
                  border: "none",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </button>
            </header>

            {/* MAIN */}
            <main
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "2rem 1.5rem",
                gap: "1.5rem",
                overflowY: "auto",
              }}
            >
              {/* INPUT BOX */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  maxWidth: "400px",
                  gap: "0.75rem",
                  backgroundColor: "#273548",
                  padding: "1.5rem",
                  borderRadius: "10px",
                }}
              >
                <input
                  placeholder="Resource"
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                  style={{
                    padding: "0.7rem",
                    borderRadius: "6px",
                    border: "1px solid #475569",
                    backgroundColor: "#334155",
                    color: "#F1F5F9",
                    outline: "none",
                  }}
                />
                <input
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  type="number"
                  style={{
                    padding: "0.7rem",
                    borderRadius: "6px",
                    border: "1px solid #475569",
                    backgroundColor: "#334155",
                    color: "#F1F5F9",
                    outline: "none",
                  }}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  name="categories"
                  id="categories"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                <button
                  onClick={() => handleAdd(resource, amount, category, type)}
                  style={{
                    alignSelf: "flex-end",
                    backgroundColor: "#3B82F6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.5rem 1.2rem",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>
              {/* RESOURCE LIST */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {resources.map((r, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#334155",
                      borderRadius: "6px",
                      padding: "0.4rem 1rem",
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
                      {r.name}: {r.amount} €, {r.category}
                    </p>
                    <button
                      onClick={() => handleDelete(index)}
                      style={{
                        backgroundColor: "#EF4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.3rem 0.7rem",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
