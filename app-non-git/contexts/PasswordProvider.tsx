import {createContext, ReactNode, useContext, useState} from "react";

const PasswordContext = createContext<{
    password: number|null;
    setPassword: (s: number) => void;
} | null>(null);

export function PasswordProvider({ children }: { children: ReactNode }) {
    const [password, setPassword] = useState<number|null>(null);

    return (
        <PasswordContext.Provider value={{ password, setPassword }}>
            {children}
        </PasswordContext.Provider>
    );
}

export function usePassword() {
    const ctx = useContext(PasswordContext);
    if (!ctx) throw new Error("usePassword must be used inside PasswordProvider");
    return ctx;
}
