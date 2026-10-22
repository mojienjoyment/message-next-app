"use client";

import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setMessage(data.msg || "Unknown response");

      if (data.status === 200 && data.token) {
        setIsSuccess(true);
        // Save JWT token in cookie for 7 days
        document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;

        setTimeout(() => {
          window.location.href = "/panel";
        }, 1000);
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Admin Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          required
          disabled={loading || isSuccess}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading || isSuccess}
        />
        <button type="submit" disabled={loading || isSuccess}>
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>

      {message && (
        <div className={`api-msg ${isSuccess ? "success" : "error"}`}>
          {isSuccess ? "✅ " : "❌ "}{message}
        </div>
      )}
    </>
  );
}