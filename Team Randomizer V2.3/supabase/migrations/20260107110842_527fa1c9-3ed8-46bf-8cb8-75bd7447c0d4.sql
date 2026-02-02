-- Fix 1: Add access control to make_user_admin function
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id UUID;
BEGIN
  -- Only allow existing admins to call this function
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can make users admin';
  END IF;
  
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email LIMIT 1;
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$function$;

-- Fix 2: Add policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());