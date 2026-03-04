"use client";

export const AUTH_KEY = "ay_webservices_auth";

export interface AuthUser {
    accountId: string;
    username: string;
    loggedInAt: string;
}

export function login(accountId: string, username: string, password: string): boolean {
    // Demo: herhangi bir account ID ile admin/admin kabul edilir
    if (username === "admin" && password === "admin") {
        const user: AuthUser = {
            accountId: accountId || "123456789012",
            username,
            loggedInAt: new Date().toISOString(),
        };
        if (typeof window !== "undefined") {
            localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        }
        return true;
    }
    return false;
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
