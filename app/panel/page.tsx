"use client";

import { useState, useEffect } from "react";

// Helper to read cookies in the browser
function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export default function PanelPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getCookie("auth_token");

        // If no token, redirect to login immediately
        if (!token) {
            window.location.href = "/";
            return;
        }

        // This fetch now runs in the browser and will show in Burp!
        fetch("/api/user/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then((data) => {
                setUser(data.user);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                // If token is invalid/expired, redirect to login
                window.location.href = "/";
            });
    }, []);

    const handleLogout = () => {
        // Delete cookie and redirect
        document.cookie = "auth_token=; max-age=0; path=/";
        window.location.href = "/";
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return null;

    return (
        <>
            <h1>Dashboard</h1>
            <p className="welcome-text">Welcome, {user.username}!</p>

            <div style={{
                textAlign: "left",
                background: "#f9fafb",
                padding: "24px",
                borderRadius: "12px",
                marginBottom: "24px",
                border: "1px solid #e5e7eb"
            }}>
                <p style={{ margin: "12px 0", color: "#1f2937" }}>
                    <strong style={{ color: "#4f46e5", minWidth: "120px", display: "inline-block" }}>Username:</strong>
                    {user.username}
                </p>
                <p style={{ margin: "12px 0", color: "#1f2937" }}>
                    <strong style={{ color: "#4f46e5", minWidth: "120px", display: "inline-block" }}>Email:</strong>
                    {user.email}
                </p>
                <p style={{ margin: "12px 0", color: "#6b7280", fontSize: "0.85rem" }}>
                    <strong style={{ minWidth: "120px", display: "inline-block" }}>Member since:</strong>
                    {user.created_at}
                </p>
                <p style={{ margin: "12px 0", color: "#6b7280", fontSize: "0.85rem" }}>
                    <strong style={{ minWidth: "120px", display: "inline-block" }}>Last updated:</strong>
                    {user.updated_at}
                </p>
            </div>

            <button onClick={handleLogout} className="logout-btn">
                Logout
            </button>
        </>
    );
}