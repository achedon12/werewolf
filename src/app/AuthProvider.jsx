"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";


const authContext = createContext({
    user: null,
    token: null,
    loading: true,
    login: async () => false,
    register: async () => false,
    logout: async () => {},
    setUser: () => {},
});

export const useAuth = () => {
    return useContext(authContext)
}

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        console.log("Attempting to log in with", email)
        console.log("Password:", password)
        const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "login", email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            return true;
        }
        return false;
    };

    const register = async (email, password, name, nickname) => {
        const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "register", email, password, name, nickname }),
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            return true;
        }
        return false;
    };

    const logout = async () => {
        setLoading(true)
        router.push("/auth");
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false)
    };

    return (
        <authContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
            {children}
        </authContext.Provider>
    );
}

export function Providers({children}) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}