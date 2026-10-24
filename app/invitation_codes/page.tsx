"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export default function InvitationCodesPage() {
    const [codes, setCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [generating, setGenerating] = useState(false);

    // Extract fetch logic so we can call it on mount AND after generating
    const fetchCodes = async (token: string) => {
        try {
            const res = await fetch("/api/invitation_codes", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch codes");
            const data = await res.json();
            setCodes(data.codes || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Could not load invitation codes.");
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = getCookie("auth_token");
        if (!token) {
            window.location.href = "/";
            return;
        }
        fetchCodes(token);
    }, []);

    const handleGenerateCode = async () => {
        const token = getCookie("auth_token");
        if (!token) return;

        setGenerating(true);
        try {
            const res = await fetch("/api/invitation_codes", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("Failed to generate code");

            const data = await res.json();
            alert(`Successfully generated new code: ${data.code}`);

            // Refresh the data to show the new code
            await fetchCodes(token);
        } catch (err) {
            console.error(err);
            alert("Failed to generate invitation code.");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="wide-container"><p>Loading...</p></div>;
    if (error) return <div className="wide-container"><p style={{ color: 'red', textAlign: 'center' }}>{error}</p></div>;

    return (
        <div className="wide-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>Invitation Codes</h1>
                <button
                    onClick={handleGenerateCode}
                    disabled={generating}
                    className="btn-primary"
                    style={{ margin: 0, padding: "10px 20px", fontSize: "0.9rem" }}
                >
                    {generating ? "Generating..." : "+ Generate New Code"}
                </button>
            </div>

            {codes.length > 0 ? (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>ID</th>
                            <th>Invitation Code</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {codes.map((code) => (
                            <tr key={code.id}>
                                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{code.id}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '0.05em', wordBreak: 'break-all' }}>
                                    {code.invitation_code}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`badge ${code.used === 1 ? 'badge-user' : 'badge-admin'}`}>
                                        {code.used === 1 ? 'Used' : 'Available'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                    No invitation codes found. Generate one to get started.
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link href="/panel" className="btn-primary">← Back to Panel</Link>
            </div>
        </div>
    );
}