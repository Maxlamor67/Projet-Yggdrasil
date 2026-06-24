import * as React from 'react'
import {authClient} from "@/lib/auth-client.ts";

export interface AuthContext {
    isAuthenticated: boolean,
    user: {
        id: string,
        email: string,
        name: string,
    } | null,
}

const AuthContext = React.createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const session = authClient.useSession();

    if (session?.isPending) {
        return;
    }

    const isAuthenticated = !!session?.data?.session;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user: session?.data?.user || null }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}