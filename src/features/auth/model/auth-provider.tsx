import { useEffect, useState } from "react";
import AuthContext from "./auth-context";
import type { Session } from "@supabase/auth-js";
import { supabase } from "@/shared/api";
import { useAppDispatch } from "@/app/store/store";
import { baseApi } from "@/app/api/base-api";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        let active = true;
        let receivedAuthEvent = false;
        let currentUserId: string | null = null;

        const updateSession = (nextSession: Session | null) => {
            if (!active) return;
            const nextUserId = nextSession?.user.id ?? null;
            if (nextUserId !== currentUserId) {
                dispatch(baseApi.util.resetApiState());
                currentUserId = nextUserId;
            }
            setSession(nextSession);
            setLoading(false);
        };

        supabase.auth
            .getSession()
            .then(({ data }) => {
                if (!receivedAuthEvent) updateSession(data.session);
            })
            .catch(error => {
                if (error instanceof Error) {
                    console.error(error.message);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            receivedAuthEvent = true;
            updateSession(session);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, [dispatch]);

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
