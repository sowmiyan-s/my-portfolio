-- Migration: Allow site upvotes to be recorded over time per user (with 24h cooldown)
-- This ensures the total upvote count represents all votes cast across all persons.

-- Update site_votes table to have an id primary key instead of restricting voter_id to unique/primary
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'site_votes' AND constraint_type = 'PRIMARY KEY' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.site_votes DROP CONSTRAINT site_votes_pkey;
  END IF;
END $$;

ALTER TABLE public.site_votes ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid() PRIMARY KEY;

-- Index to optimize querying a voter's latest vote for cooldown checks
CREATE INDEX IF NOT EXISTS idx_site_votes_voter_created ON public.site_votes (voter_id, created_at DESC);

-- Update has_voted to return TRUE only if voter has voted in the past 24 hours
CREATE OR REPLACE FUNCTION public.has_voted(_voter_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
  SELECT EXISTS (
    SELECT 1 FROM public.site_votes 
    WHERE voter_id = _voter_id 
      AND created_at > (now() - interval '24 hours')
  ) 
$$;

-- Function to get the latest vote time for a voter
CREATE OR REPLACE FUNCTION public.get_last_vote_time(_voter_id text)
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
  SELECT created_at FROM public.site_votes 
  WHERE voter_id = _voter_id 
  ORDER BY created_at DESC 
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.has_voted(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_last_vote_time(text) TO anon, authenticated;
