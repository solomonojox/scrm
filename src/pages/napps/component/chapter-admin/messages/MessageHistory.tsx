"use client";

import { useState } from "react";
import { Clock, Users, ChevronRight } from "lucide-react";

interface Message {
    id: number;
    subject: string;
    body: string;
    sentAt: string;
    status: "Sent" | "Failed" | "Pending";
    recipients: string[];
}

const MESSAGES: Message[] = [
    {
        id: 1,
        subject: "Welcome to EduCat NAPPS",
        body: "Welcome to the EduCat NAPPS Chapter Management System. We are excited to have you on board.",
        sentAt: "2024-02-20 10:30 AM",
        status: "Sent",
        recipients: ["Capital Heights Academy", "Bright Future School"],
    },
    {
        id: 2,
        subject: "System Update Reminder",
        body: "Please ensure all student data is updated in the system by the end of this week.",
        sentAt: "2024-02-22 02:15 PM",
        status: "Sent",
        recipients: ["Capital Heights Academy", "Bright Future School"],
    },
];

const STATUS_STYLES: Record<Message["status"], { bg: string; color: string }> = {
    Sent: { bg: "#f0fdf4", color: "#16a34a" },
    Failed: { bg: "#fef2f2", color: "#dc2626" },
    Pending: { bg: "#fffbeb", color: "#d97706" },
};

function MessageRow({ message }: { message: Message }) {
    const [open, setOpen] = useState(false);
    const status = STATUS_STYLES[message.status];

    return (
        <div
            style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f1f5f9",
                transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                {/* Left */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                        {message.subject}
                    </h3>
                    <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.5, marginBottom: 10 }}>
                        {message.body}
                    </p>

                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#9ca3af" }}>
                            <Clock size={13} />
                            {message.sentAt}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#9ca3af" }}>
                            <Users size={13} />
                            {message.recipients.length} recipient{message.recipients.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Toggle */}
                    <button
                        onClick={() => setOpen(o => !o)}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            marginTop: 10, background: "none", border: "none",
                            cursor: "pointer", padding: 0,
                            fontSize: 13, fontWeight: 500,
                            transition: "color 0.15s",
                        }}
                        className="text-orange-500"
                        onMouseEnter={e => (e.currentTarget.style.color = "#1d4ed8")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#3b82f6")}
                    >
                        <ChevronRight
                            size={14}
                            style={{
                                transition: "transform 0.2s",
                                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                        />
                        {open ? "Hide recipients" : "View recipients"}
                    </button>

                    {/* Collapsible recipients */}
                    <div
                        style={{
                            overflow: "hidden",
                            maxHeight: open ? message.recipients.length * 36 + 16 : 0,
                            opacity: open ? 1 : 0,
                            transition: "max-height 0.3s ease, opacity 0.25s ease",
                        }}
                    >
                        <ul
                            style={{
                                marginTop: 10,
                                padding: "10px 14px",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: 8,
                                listStyle: "none",
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                            }}
                        >
                            {message.recipients.map((r) => (
                                <li
                                    key={r}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        fontSize: 13, color: "#374151",
                                    }}
                                >
                                    <span style={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        background: "#3b82f6", flexShrink: 0,
                                    }} />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Status badge */}
                <span
                    style={{
                        flexShrink: 0,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 500,
                        background: status.bg,
                        color: status.color,
                    }}
                >
                    {message.status}
                </span>
            </div>
        </div>
    );
}

export default function MessageHistory() {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                overflow: "hidden",
                fontFamily: "'Inter', 'Gotham', sans-serif",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "18px 24px",
                    borderBottom: "1px solid #f1f5f9",
                }}
            >
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                    Message History
                </h2>
            </div>

            {/* Messages */}
            {MESSAGES.length > 0 ? (
                MESSAGES.map((msg) => <MessageRow key={msg.id} message={msg} />)
            ) : (
                <div style={{ padding: 48, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                    No messages sent yet.
                </div>
            )}
        </div>
    );
}