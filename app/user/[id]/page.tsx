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
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

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
                setFormData(data.user); // Initialize form with current data
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Could not load user.");
                setLoading(false);
            });
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSave = async () => {
        if (!formData) return;
        setIsSaving(true);
        const token = getCookie("auth_token");

        try {
            const res = await fetch(`/api/user/${userId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    is_admin: formData.is_admin ? 1 : 0
                })
            });

            if (!res.ok) throw new Error("Failed to update user");

            setUser({ ...formData }); // Update original data to match saved state
            alert("User updated successfully!");
        } catch (err) {
            alert("Error updating user. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Revert form back to original fetched data
        if (user) setFormData({ ...user });
    };

    if (loading) return <div className="wide-container"><p>Loading user details...</p></div>;
    if (error) return <div className="wide-container"><p style={{ color: 'red', textAlign: 'center' }}>{error}</p></div>;
    if (!user || !formData) return null;

    return (
        <div className="wide-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>Edit User: {user.username}</h1>
                <Link href="/users" className="btn">← Back to Users</Link>
            </div>

            <div className="info-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                {/* ID is read-only */}
                <p className="info-row">
                    <span className="info-label">ID:</span>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{user.id}</span>
                </p>

                {/* Editable Name */}
                <p className="info-row">
                    <span className="info-label">Name:</span>
                    <input
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', maxWidth: '300px', fontFamily: 'inherit' }}
                    />
                </p>

                {/* Editable Username */}
                <p className="info-row">
                    <span className="info-label">Username:</span>
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', maxWidth: '300px', fontFamily: 'inherit' }}
                    />
                </p>

                {/* Editable Email */}
                <p className="info-row">
                    <span className="info-label">Email:</span>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', maxWidth: '300px', fontFamily: 'inherit' }}
                    />
                </p>

                {/* Editable Role */}
                <p className="info-row">
                    <span className="info-label">Role:</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '4px' }}>
                        <input
                            type="checkbox"
                            name="is_admin"
                            checked={formData.is_admin === 1}
                            onChange={handleInputChange}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 600 }}>Is Admin</span>
                    </label>
                </p>

                <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }}></div>

                {/* Read-only Timestamps */}
                <p className="info-row" style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "8px" }}>
                    <span className="info-label" style={{ color: "var(--muted)", minWidth: "100px" }}>Created:</span>
                    {user.created_at}
                </p>
                <p className="info-row" style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0" }}>
                    <span className="info-label" style={{ color: "var(--muted)", minWidth: "100px" }}>Updated:</span>
                    {user.updated_at}
                </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
                <button className="btn" onClick={handleCancel} disabled={isSaving}>
                    Cancel Changes
                </button>
                <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ marginTop: 0 }}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}