import { supabase } from "@/shared/api";

const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);
    }
};

export default handleLogout;
