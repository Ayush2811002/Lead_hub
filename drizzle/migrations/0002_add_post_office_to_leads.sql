ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS post_office TEXT;
