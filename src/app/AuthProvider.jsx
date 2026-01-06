"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

const authContext = createContext({
    user: null,
    token: null,
    loading: true,
    theme: "light",
    login: async () => false,
    register: async () => false,
    logout: async () => {
    },
    setUser: () => {
    },
    setPlayer: () => {
    },
    setGame: () => {
    },
    setTheme: () => {
    },
});

export const useAuth = () => {
    return useContext(authContext);
}

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [player, setPlayer] = useState(null);
    const [game, setGame] = useState(null);
    const router = useRouter();
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const lastLogin = localStorage.getItem("lastLogin");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
        // Auto logout after 24 hours
        if (!lastLogin || Date.now() - parseInt(lastLogin) > 24 * 60 * 60 * 1000) {
            logout();
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "user") {
                const newUser = event.newValue ? JSON.parse(event.newValue) : null;
                setUser(newUser);
            }
            if (event.key === "token") {
                setToken(event.newValue);
            }
            if (event.key === "theme") {
                setTheme(event.newValue || "light");
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth");
        }
    }, [loading, user, router]);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return;
        }

        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const applyPref = (e) => {
            const isDark = e?.matches ?? mql.matches;
            setTheme(isDark ? "dark" : "light");
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        applyPref(mql);

        if (typeof mql.addEventListener === "function") {
            mql.addEventListener("change", applyPref);
            return () => mql.removeEventListener("change", applyPref);
        } else if (typeof mql.addListener === "function") {
            mql.addListener(applyPref);
            return () => mql.removeListener(applyPref);
        }
    }, []);

    useEffect(() => {
        if (!theme) return;
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const login = async (email, password) => {
        const res = await fetch("/api/auth", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({action: "login", email, password}),
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            localStorage.setItem("lastLogin", Date.now().toString());
            return true;
        }
        return false;
    };

    const register = async (email, password, name, nickname) => {
        const res = await fetch("/api/auth", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({action: "register", email, password, name, nickname}),
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
        setLoading(true);
        router.push("/auth");
        setUser(null);
        setToken(null);
        setPlayer(null);
        setGame(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false);
    };

    return (
        <authContext.Provider value={{
            user,
            token,
            loading,
            game,
            player,
            login,
            register,
            logout,
            setUser,
            setPlayer,
            setGame,
            theme,
            setTheme
        }}>
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