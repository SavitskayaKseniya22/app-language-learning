import { useEffect, useState } from "react";
import AuthContext from "./auth-context";
import type { Session } from "@supabase/auth-js";
import { supabase } from "@/shared/api";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth
            .getSession()
            .then(({ data }) => {
                setSession(data.session);
            })
            .catch(error => {
                if (error instanceof Error) {
                    console.error(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                loading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
