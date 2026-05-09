import { useState, CSSProperties, MouseEvent } from "react";
import {
    LayoutDashboard,
    School,
    BarChart3,
    MessageSquare,
    GraduationCap,
    Users,
    DollarSign,
    LogOut,
    LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

type SuperAdminNavId = "dashboard" | "schools" | "chapters" | "chapter-admins";
type ChapterAdminNavId = "dashboard" | "schools" | "revenue" | "messages";
type NavItemId = SuperAdminNavId | ChapterAdminNavId;

type SidebarVariant = "super-admin" | "chapter-admin";

interface NavItem {
    id: NavItemId;
    label: string;
    icon: LucideIcon;
    path: string;
}

interface User {
    name: string;
    email: string;
    role: string;
    avatarInitials?: string;
}

interface SidebarProps {
    variant: SidebarVariant;
    activeItem?: NavItemId;
    user?: User;
    onNavigate?: (id: NavItemId) => void;
    onLogout?: () => void;
}

// ─── Nav Configs ──────────────────────────────────────────────────────────────

const SUPER_ADMIN_NAV: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/napps/super-admin/dashboard" },
    { id: "chapters", label: "Chapters", icon: BarChart3, path: "/napps/super-admin/chapters" },
    { id: "schools", label: "Schools", icon: School, path: "/napps/super-admin/schools" },
    { id: "chapter-admins", label: "Chapter Admins", icon: Users, path: "/napps/super-admin/chapter-admins" },
];

const CHAPTER_ADMIN_NAV: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/napps/chapter-admin/dashboard" },
    { id: "schools", label: "Schools", icon: School, path: "/napps/chapter-admin/schools" },
    { id: "revenue", label: "Revenue", icon: DollarSign, path: "/napps/chapter-admin/revenue" },
    { id: "messages", label: "Messages", icon: MessageSquare, path: "/napps/chapter-admin/messages" },
];

const DEFAULT_USERS: Record<SidebarVariant, User> = {
    "super-admin": {
        name: "Super Admin",
        email: "admin@napps.ng",
        role: "Super Admin",
        avatarInitials: "SA",
    },
    "chapter-admin": {
        name: "Lagos Chapter Admin",
        email: "lagos@napps.ng",
        role: "Chapter Admin",
        avatarInitials: "LA",
    },
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
    sidebar: {
        width: 264,
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #EAECF0",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', 'Inter', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
    } satisfies CSSProperties,

    // Subtle top accent stripe
    accentStripe: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "linear-gradient(90deg, #4F46E5 0%, #7C3AED 50%, #4F46E5 100%)",
    } satisfies CSSProperties,

    logoSection: {
        padding: "28px 20px 22px",
        borderBottom: "1px solid #EAECF0",
        display: "flex",
        alignItems: "center",
        gap: 12,
    } satisfies CSSProperties,

    logoIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
    } satisfies CSSProperties,

    logoText: {
        display: "flex",
        flexDirection: "column",
    } satisfies CSSProperties,

    logoTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: "#101828",
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
    } satisfies CSSProperties,

    logoSubtitle: {
        fontSize: 12,
        color: "#98A2B3",
        marginTop: 2,
        fontWeight: 400,
        letterSpacing: "0.01em",
    } satisfies CSSProperties,

    variantBadge: (variant: SidebarVariant) => ({
        display: "inline-block",
        marginTop: 4,
        padding: "2px 8px",
        borderRadius: 20,
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase" as const,
        background: variant === "super-admin" ? "#EFF6FF" : "#F0FDF4",
        color: variant === "super-admin" ? "#2563EB" : "#16A34A",
    }),

    navSection: {
        flex: 1,
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto" as const,
    } satisfies CSSProperties,

    navLabel: {
        fontSize: 10.5,
        fontWeight: 600,
        color: "#98A2B3",
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        padding: "8px 10px 6px",
        marginTop: 4,
    } satisfies CSSProperties,

    footer: {
        borderTop: "1px solid #EAECF0",
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
    } satisfies CSSProperties,

    userCard: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 10px",
        borderRadius: 10,
        background: "#F9FAFB",
        marginBottom: 4,
    } satisfies CSSProperties,

    avatarCircle: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 13,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "0.02em",
    } satisfies CSSProperties,

    userDetails: {
        flex: 1,
        minWidth: 0,
    } satisfies CSSProperties,

    userName: {
        fontSize: 13.5,
        fontWeight: 600,
        color: "#101828",
        lineHeight: 1.3,
        whiteSpace: "nowrap" as const,
        overflow: "hidden",
        textOverflow: "ellipsis",
    } satisfies CSSProperties,

    userEmail: {
        fontSize: 12,
        color: "#667085",
        marginTop: 1,
        whiteSpace: "nowrap" as const,
        overflow: "hidden",
        textOverflow: "ellipsis",
    } satisfies CSSProperties,
} as const;

function navItemStyle(isActive: boolean): CSSProperties {
    return {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer",
        background: isActive ? "#EEF2FF" : "transparent",
        color: isActive ? "#4338CA" : "#344054",
        fontWeight: isActive ? 600 : 400,
        fontSize: 14.5,
        userSelect: "none",
        border: "none",
        width: "100%",
        textAlign: "left",
        transition: "background 0.15s ease, color 0.15s ease",
        position: "relative",
    };
}

function navIconStyle(isActive: boolean): CSSProperties {
    return {
        color: isActive ? "#4338CA" : "#667085",
        flexShrink: 0,
        transition: "color 0.15s ease",
    };
}

function activeIndicatorStyle(): CSSProperties {
    return {
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: 3,
        height: 20,
        borderRadius: "0 3px 3px 0",
        background: "#4F46E5",
    };
}

function logoutButtonStyle(isHovered: boolean): CSSProperties {
    return {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer",
        background: isHovered ? "#FEF2F2" : "transparent",
        color: isHovered ? "#DC2626" : "#667085",
        fontWeight: 500,
        fontSize: 14.5,
        userSelect: "none",
        border: "none",
        width: "100%",
        textAlign: "left",
        transition: "background 0.15s ease, color 0.15s ease",
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NappsSidebar({
    variant = "chapter-admin",
    activeItem = "dashboard",
    user,
    onNavigate,
    onLogout,
}: SidebarProps) {
    const [active, setActive] = useState<NavItemId>(activeItem);
    const [logoutHovered, setLogoutHovered] = useState(false);
    const navigate = useNavigate();

    const NAV_ITEMS = variant === "super-admin" ? SUPER_ADMIN_NAV : CHAPTER_ADMIN_NAV;
    const resolvedUser = user ?? DEFAULT_USERS[variant];
    const initials = resolvedUser.avatarInitials
        ?? resolvedUser.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

    const handleNav = (item: NavItem): void => {
        setActive(item.id);
        onNavigate?.(item.id);
        navigate(item.path);
    };

    const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>, isActive: boolean): void => {
        if (!isActive) e.currentTarget.style.background = "#F9FAFB";
    };

    const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>, isActive: boolean): void => {
        if (!isActive) e.currentTarget.style.background = "transparent";
    };

    return (
        <div style={S.sidebar}>
            {/* Top accent stripe */}
            <div style={S.accentStripe} />

            {/* Logo */}
            <div style={S.logoSection}>
                <div style={S.logoIcon}>
                    <GraduationCap size={22} color="#fff" strokeWidth={2} />
                </div>
                <div style={S.logoText}>
                    <span style={S.logoTitle}>EduCat NAPPS</span>
                    <span style={S.logoSubtitle}>Management System</span>
                    <span style={S.variantBadge(variant)}>
                        {variant === "super-admin" ? "Super Admin" : "Chapter Admin"}
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={S.navSection}>
                <div style={S.navLabel}>Menu</div>

                {NAV_ITEMS.map((item) => {
                    const isActive = active === item.id;
                    const { id, label, icon: Icon } = item;
                    return (
                        <button
                            key={id}
                            style={navItemStyle(isActive)}
                            onClick={() => handleNav(item)}
                            onMouseEnter={(e) => handleMouseEnter(e, isActive)}
                            onMouseLeave={(e) => handleMouseLeave(e, isActive)}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {isActive && <span style={activeIndicatorStyle()} />}
                            <Icon size={18} strokeWidth={isActive ? 2 : 1.75} style={navIconStyle(isActive)} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={S.footer}>
                {/* User card */}
                <div style={S.userCard}>
                    <div style={S.avatarCircle}>{initials}</div>
                    <div style={S.userDetails}>
                        <div style={S.userName}>{resolvedUser.name}</div>
                        <div style={S.userEmail}>{resolvedUser.email}</div>
                    </div>
                </div>

                {/* Logout */}
                <button
                    style={logoutButtonStyle(logoutHovered)}
                    onMouseEnter={() => setLogoutHovered(true)}
                    onMouseLeave={() => setLogoutHovered(false)}
                    onClick={onLogout}
                >
                    <LogOut size={18} strokeWidth={1.75} />
                    Log out
                </button>
            </div>
        </div>
    );
}