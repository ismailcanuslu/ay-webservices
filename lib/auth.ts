"use client";

export const AUTH_KEY = "ay_webservices_auth";

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8000";

export interface AuthUser {
    realmName: string;
    email: string;
    username: string;       // preferred_username
    firstName: string;
    lastName: string;
    fullName: string;
    roles: string[];        // realm_access.roles
    primaryRole: string;    // en yüksek öncelikli rol
    accessToken: string;
    refreshToken: string;
    loggedInAt: string;
}

export interface RegisterPayload {
    realmName: string;
    displayName: string;
    ownerEmail: string;
    ownerFirstName: string;
    ownerLastName: string;
    ownerPassword: string;
}

export interface RegisterResult {
    ok: boolean;
    tenantId?: string;
    realmName?: string;
    error?: string;
}

export interface LoginResult {
    ok: boolean;
    error?: string;
}

// Rol öncelik sırası (ilk = en yüksek)
const ROLE_PRIORITY = ["owner", "admin", "developer", "billing", "readonly"];

function parseJwt(token: string): Record<string, unknown> {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return {};
    }
}

function extractUserFromToken(token: string, realmName: string, refreshToken: string): AuthUser {
    const payload = parseJwt(token);

    const email = (payload.email as string) ?? "";
    const username = (payload.preferred_username as string) ?? email;
    const firstName = (payload.given_name as string) ?? "";
    const lastName = (payload.family_name as string) ?? "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || username;

    const realmAccess = payload.realm_access as { roles?: string[] } | undefined;
    const allRoles = realmAccess?.roles ?? [];
    const roles = allRoles.filter((r) => ROLE_PRIORITY.includes(r));
    const primaryRole = ROLE_PRIORITY.find((r) => roles.includes(r)) ?? "readonly";

    return {
        realmName,
        email,
        username,
        firstName,
        lastName,
        fullName,
        roles,
        primaryRole,
        accessToken: token,
        refreshToken,
        loggedInAt: new Date().toISOString(),
    };
}

/** Tenant kaydı — gateway → security-service */
export async function register(payload: RegisterPayload): Promise<RegisterResult> {
    try {
        const res = await fetch(`${GATEWAY_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (!res.ok) {
            const errorMsg =
                json?.errors?.[0] ??
                json?.error ??
                json?.title ??
                "Kayıt sırasında bir hata oluştu.";
            return { ok: false, error: errorMsg };
        }

        return { ok: true, tenantId: json?.data?.tenantId, realmName: json?.data?.realmName };
    } catch {
        return { ok: false, error: "Sunucuya bağlanılamadı. Lütfen tekrar deneyin." };
    }
}

/** Keycloak token isteği — gateway → Keycloak (/realms/{realm}/...) */
export async function login(
    realmName: string,
    email: string,
    password: string
): Promise<LoginResult> {
    try {
        const body = new URLSearchParams({
            grant_type: "password",
            client_id: "account",
            username: email,
            password,
        });

        const res = await fetch(
            `${GATEWAY_URL}/realms/${realmName}/protocol/openid-connect/token`,
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body.toString(),
            }
        );

        const json = await res.json();

        if (!res.ok) {
            const msg =
                json?.error_description === "Invalid user credentials"
                    ? "E-posta adresi veya şifre hatalı."
                    : json?.error_description ?? "Giriş başarısız.";
            return { ok: false, error: msg };
        }

        const user = extractUserFromToken(json.access_token, realmName, json.refresh_token);

        if (typeof window !== "undefined") {
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        }

        return { ok: true };
    } catch {
        return { ok: false, error: "Sunucuya bağlanılamadı. Lütfen tekrar deneyin." };
    }
}

export function logout(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_KEY);
    }
}

export function getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export function isAuthenticated(): boolean {
    return getUser() !== null;
}

/** İnisyaller (avatar için) */
export function getInitials(user: AuthUser): string {
    if (user.firstName && user.lastName)
        return (user.firstName[0] + user.lastName[0]).toUpperCase();
    if (user.username) return user.username.slice(0, 2).toUpperCase();
    return "AY";
}

/** Rol etiketi (Türkçe) */
export const ROLE_LABELS: Record<string, string> = {
    owner: "Hesap Sahibi",
    admin: "Yönetici",
    developer: "Geliştirici",
    billing: "Fatura & Ödeme",
    readonly: "Salt Okunur",
};
