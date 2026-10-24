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

    useEffect(() => {
        const token = getCookie("auth_token");
        if (!token) {
            window.location.href = "/";
            return;
        }

        fetch("/api/invitation_codes", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch codes");
                return res.json();
            })
            .then((data) => {
                setCodes(data.codes || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load invitation codes.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="wide-container"><p>Loading...</p></div>;
    if (error) return <div className="wide-container"><p style={{ color: 'red', textAlign: 'center' }}>{error}</p></div>;

    return (
        <div className="wide-container">
            <h1>Invitation Codes</h1>

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
                    No invitation codes found.
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link href="/panel" className="btn-primary">← Back to Panel</Link>
            </div>
        </div>
    );
}