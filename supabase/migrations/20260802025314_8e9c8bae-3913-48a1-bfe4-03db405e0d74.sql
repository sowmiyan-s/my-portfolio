DROP POLICY IF EXISTS "Public read votes" ON public.site_votes;
REVOKE SELECT ON public.site_votes FROM anon, authenticated;
GRANT ALL ON public.site_votes TO service_role;

CREATE OR REPLACE FUNCTION public.get_vote_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT count(*) FROM public.site_votes $$;

CREATE OR REPLACE FUNCTION public.has_voted(_voter_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.site_votes WHERE voter_id = _voter_id) $$;

GRANT EXECUTE ON FUNCTION public.get_vote_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_voted(text) TO anon, authenticated;