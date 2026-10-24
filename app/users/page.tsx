"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = getCookie("auth_token");
        if (!token) { window.location.href = "/"; return; }

        fetch("/api/users", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((res) => { if (!res.ok) throw new Error("Failed"); return res.json(); })
            .then((data) => { setUsers(data.users || []); setLoading(false); })
            .catch(() => { setError("Could not load users."); setLoading(false); });
    }, []);

    const handleEdit = (id: number, name: string) => alert(`Edit ${name}`);
    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Delete ${name}?`)) alert(`Deleted ${id}`);
    };

    if (loading) return <div className="wide-container"><p>Loading...</p></div>;
    if (error) return <div className="wide-container"><p style={{ color: 'red' }}>{error}</p></div>;

    return (
        <div className="wide-container">
            <h1>Users Management</h1>
            <table className="data-table">
                <thead>
                    <tr>
                        <th style={{ width: '60px' }}>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Role</th>
                        <th style={{ width: '180px', textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{user.id}</td>
                            <td>{user.name || "—"}</td>
                            <td><span className="badge badge-username">{user.username}</span></td>
                            <td style={{ color: 'var(--muted)' }}>{user.email}</td>
                            <td style={{ textAlign: 'center' }}>
                                <span className={`badge ${user.is_admin ? 'badge-admin' : 'badge-user'}`}>
                                    {user.is_admin ? 'Admin' : 'User'}
                                </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    <button className="btn" onClick={() => handleEdit(user.id, user.username)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(user.id, user.username)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link href="/panel" className="btn-primary">← Back to Panel</Link>
            </div>
        </div>
    );
}