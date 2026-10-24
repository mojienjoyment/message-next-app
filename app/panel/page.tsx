"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export default function PanelPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getCookie("auth_token");
        if (!token) {
            window.location.href = "/";
            return;
        }

        fetch("/api/user/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then((data) => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => {
                window.location.href = "/";
            });
    }, []);

    const handleLogout = () => {
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
            </div>

            {/* Navigation Menu */}
            <nav>
                <ul>
                    <li><Link href="/users">users</Link></li>
                    <li><Link href="/server">server</Link></li>
                    <li><Link href="/statistics">statistics</Link></li>
                </ul>
            </nav>

            <button onClick={handleLogout} className="logout-btn" style={{ marginTop: "24px" }}>
                Logout
            </button>
        </>
    );
}