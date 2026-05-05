import { useState, CSSProperties, MouseEvent } from "react";
import {
    LayoutDashboard,
    School,
    BarChart3,
    MessageSquare,
    GraduationCap,
    LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItemId = "dashboard" | "schools" | "revenue" | "messages";

interface NavItem {
    id: NavItemId;
    label: string;
    icon: LucideIcon;
}

interface User {
    name: string;
    email: string;
    role: string;
}

interface SidebarProps {
    activeItem?: NavItemId;
    user?: User;
    onNavigate?: (id: NavItemId) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "schools", label: "Schools", icon: School },
    { id: "revenue", label: "Revenue", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageSquare },
];

const DEFAULT_USER: User = {
    name: "Lagos Chapter Admin",
    email: "lagos@napps.ng",
    role: "Chapter Admin",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const staticStyles = {
    sidebar: {
        width: 260,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #e8e8f0",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    } satisfies CSSProperties,

    logoSection: {
        padding: "24px 20px",
        borderBottom: "1px solid #e8e8f0",
        display: "flex",
        alignItems: "center",
        gap: 14,
    } satisfies CSSProperties,

    logoIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        background: "#4F46E5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    } satisfies CSSProperties,

    logoText: {
        display: "flex",
        flexDirection: "column",
    } satisfies CSSProperties,

    logoTitle: {
        fontSize: 17,
        fontWeight: 700,
        color: "#111827",
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
    } satisfies CSSProperties,

    logoSubtitle: {
        fontSize: 12.5,
        color: "#9ca3af",
        marginTop: 2,
        fontWeight: 400,
    } satisfies CSSProperties,

    nav: {
        flex: 1,
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
    } satisfies CSSProperties,

    footer: {
        borderTop: "1px solid #e8e8f0",
        padding: "20px",
    } satisfies CSSProperties,

    userInfo: {
        marginBottom: 12,
    } satisfies CSSProperties,

    userName: {
        fontSize: 14.5,
        fontWeight: 700,
        color: "#111827",
        lineHeight: 1.3,
    } satisfies CSSProperties,

    userEmail: {
        fontSize: 13,
        color: "#6b7280",
        marginTop: 2,
    } satisfies CSSProperties,

    userRole: {
        fontSize: 13,
        color: "#4F46E5",
        marginTop: 3,
        fontWeight: 500,
    } satisfies CSSProperties,

    cookieLink: {
        fontSize: 12.5,
        color: "#9ca3af",
        cursor: "pointer",
        marginTop: 12,
        display: "block",
    } satisfies CSSProperties,
} as const;

function navItemStyle(isActive: boolean): CSSProperties {
    return {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "11px 14px",
        borderRadius: 10,
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
        background: isActive ? "#EEF2FF" : "transparent",
        color: isActive ? "#4F46E5" : "#374151",
        fontWeight: isActive ? 500 : 400,
        fontSize: 15,
        userSelect: "none",
        border: "none",
        width: "100%",
        textAlign: "left",
    };
}

function navIconStyle(isActive: boolean): CSSProperties {
    return {
        color: isActive ? "#4F46E5" : "#6b7280",
        flexShrink: 0,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NappsSidebar({
    activeItem = "messages",
    user = DEFAULT_USER,
    onNavigate,
}: SidebarProps) {
    const [active, setActive] = useState<NavItemId>(activeItem);

    const handleNav = (id: NavItemId): void => {
        setActive(id);
        onNavigate?.(id);
    };

    const handleMouseEnter = (
        e: MouseEvent<HTMLButtonElement>,
        isActive: boolean
    ): void => {
        if (!isActive) e.currentTarget.style.background = "#f9fafb";
    };

    const handleMouseLeave = (
        e: MouseEvent<HTMLButtonElement>,
        isActive: boolean
    ): void => {
        if (!isActive) e.currentTarget.style.background = "transparent";
    };

    return (
        <div style={staticStyles.sidebar}>
            {/* Logo */}
            <div style={staticStyles.logoSection}>
                <div style={staticStyles.logoIcon}>
                    <GraduationCap size={26} color="#fff" strokeWidth={2} />
                </div>
                <div style={staticStyles.logoText}>
                    <span style={staticStyles.logoTitle}>EduCat NAPPS</span>
                    <span style={staticStyles.logoSubtitle}>Management System</span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={staticStyles.nav}>
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                    const isActive = active === id;
                    return (
                        <button
                            key={id}
                            style={navItemStyle(isActive)}
                            onClick={() => handleNav(id)}
                            onMouseEnter={(e) => handleMouseEnter(e, isActive)}
                            onMouseLeave={(e) => handleMouseLeave(e, isActive)}
                        >
                            <Icon size={20} strokeWidth={1.75} style={navIconStyle(isActive)} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div style={staticStyles.footer}>
                <div style={staticStyles.userInfo}>
                    <div style={staticStyles.userName}>{user.name}</div>
                    <div style={staticStyles.userEmail}>{user.email}</div>
                    <div style={staticStyles.userRole}>{user.role}</div>
                </div>
                <span style={staticStyles.cookieLink}>Manage cookies or opt out</span>
            </div>
        </div>
    );
}