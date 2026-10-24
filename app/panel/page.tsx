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
        if (!token) { window.location.href = "/"; return; }

        fetch("/api/user/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((res) => { if (!res.ok) throw new Error("Unauthorized"); return res.json(); })
            .then((data) => { setUser(data.user); setLoading(false); })
            .catch(() => { window.location.href = "/"; });
    }, []);

    const handleLogout = () => {
        document.cookie = "auth_token=; max-age=0; path=/";
        window.location.href = "/";
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return null;

    return (
        <div className="dash-card">
            <h1>Dashboard</h1>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)" }}>Welcome, {user.username}!</p>

            <div className="info-card">
                <p className="info-row"><span className="info-label">Username:</span> {user.username}</p>
                <p className="info-row"><span className="info-label">Email:</span> {user.email}</p>
            </div>

            <ul className="nav-pills">
                <li><Link href="/users">Users</Link></li>
                <li><Link href="/server">Server</Link></li>
                <li><Link href="/statistics">Statistics</Link></li>
            </ul>

            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
    );
}