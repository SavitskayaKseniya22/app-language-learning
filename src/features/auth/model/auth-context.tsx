import type { User } from "@supabase/supabase-js";
import { createContext } from "react";
import type { Session } from "@supabase/auth-js";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
});

export default AuthContext;
