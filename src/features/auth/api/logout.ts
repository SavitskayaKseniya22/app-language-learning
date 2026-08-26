import { supabase } from "@/shared/api/supabase/config";

const handleLogout = async () => {
    console.log("donwe");
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);
    }
};

export default handleLogout;
