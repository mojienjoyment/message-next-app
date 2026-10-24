"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export default function UserDetailPage() {
    const params = useParams();
    const userId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = getCookie("auth_token");
        if (!token) {
            window.location.href = "/";
            return;
        }

        fetch(`/api/user/${userId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((res) => {
                if (res.status === 404) throw new Error("User not found");
                if (!res.ok) throw new Error("Failed to fetch user");
                return res.json();
            })
            .then((data) => {
                setUser(data.user);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Could not load user.");
                setLoading(false);
            });
    }, [userId]);

    if (loading) return <div className="wide-container"><p>Loading user details...</p></div>;
    if (error) return <div className="wide-container"><p style={{ color: 'red', textAlign: 'center' }}>{error}</p></div>;
    if (!user) return null;

    return (
        <div className="wide-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>User Details</h1>
                <Link href="/users" className="btn">← Back to Users</Link>
            </div>

            <div className="info-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <p className="info-row">
                    <span className="info-label">ID:</span>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{user.id}</span>
                </p>
                <p className="info-row">
                    <span className="info-label">Name:</span>
                    {user.name || "—"}
                </p>
                <p className="info-row">
                    <span className="info-label">Username:</span>
                    <span className="badge badge-username">{user.username}</span>
                </p>
                <p className="info-row">
                    <span className="info-label">Email:</span>
                    {user.email}
                </p>
                <p className="info-row">
                    <span className="info-label">Role:</span>
                    <span className={`badge ${user.is_admin ? 'badge-admin' : 'badge-user'}`}>
                        {user.is_admin ? 'Admin' : 'User'}
                    </span>
                </p>
                <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }}></div>
                <p className="info-row" style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "8px" }}>
                    <span className="info-label" style={{ color: "var(--muted)", minWidth: "100px" }}>Created:</span>
                    {user.created_at}
                </p>
                <p className="info-row" style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0" }}>
                    <span className="info-label" style={{ color: "var(--muted)", minWidth: "100px" }}>Updated:</span>
                    {user.updated_at}
                </p>
            </div>
        </div>
    );
}