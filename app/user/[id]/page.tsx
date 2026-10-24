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

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>(null);
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
                setFormData(data.user); // Initialize form data
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
                    is_admin: formData.is_admin ? 1 : 0 // Convert boolean to 1/0 for Flask
                })
            });

            if (!res.ok) throw new Error("Failed to update user");

            setUser({ ...formData }); // Update the view state
            setIsEditing(false);
        } catch (err) {
            alert("Error updating user. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="wide-container"><p>Loading user details...</p></div>;
    if (error) return <div className="wide-container"><p style={{ color: 'red', textAlign: 'center' }}>{error}</p></div>;
    if (!user || !formData) return null;

    return (
        <div className="wide-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>User Details</h1>
                <div style={{ display: "flex", gap: "12px" }}>
                    {!isEditing && (
                        <button className="btn" onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                    <Link href="/users" className="btn">← Back to Users</Link>
                </div>
            </div>

            <div className="info-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <p className="info-row">
                    <span className="info-label">ID:</span>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{user.id}</span>
                </p>

                {/* Name Field */}
                <p className="info-row">
                    <span className="info-label">Name:</span>
                    {isEditing ? (
                        <input
                            name="name" value={formData.name || ''} onChange={handleInputChange}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', width: '200px' }}
                        />
                    ) : (
                        user.name || "—"
                    )}
                </p>

                {/* Username Field */}
                <p className="info-row">
                    <span className="info-label">Username:</span>
                    {isEditing ? (
                        <input
                            name="username" value={formData.username} onChange={handleInputChange}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', width: '200px' }}
                        />
                    ) : (
                        <span className="badge badge-username">{user.username}</span>
                    )}
                </p>

                {/* Email Field */}
                <p className="info-row">
                    <span className="info-label">Email:</span>
                    {isEditing ? (
                        <input
                            name="email" type="email" value={formData.email} onChange={handleInputChange}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', width: '250px' }}
                        />
                    ) : (
                        user.email
                    )}
                </p>

                {/* Role Field */}
                <p className="info-row">
                    <span className="info-label">Role:</span>
                    {isEditing ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox" name="is_admin"
                                checked={formData.is_admin === 1} onChange={handleInputChange}
                                style={{ width: '16px', height: '16px' }}
                            />
                            Is Admin
                        </label>
                    ) : (
                        <span className={`badge ${user.is_admin ? 'badge-admin' : 'badge-user'}`}>
                            {user.is_admin ? 'Admin' : 'User'}
                        </span>
                    )}
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

            {/* Save/Cancel Buttons */}
            {isEditing && (
                <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
                    <button className="btn" onClick={() => { setIsEditing(false); setFormData(user); }} disabled={isSaving}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSave} disabled={isSaving} style={{ marginTop: 0 }}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            )}
        </div>
    );
}