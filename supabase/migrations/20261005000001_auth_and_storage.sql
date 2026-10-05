-- Application objects outside public, read from the existing Supabase project.
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Only bucket configuration; uploaded images and audio are not part of migrations.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('words', 'words', true, NULL, NULL);
