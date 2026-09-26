ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS post_office TEXT;
ALTER TABLE public.due_diligence
ADD COLUMN status text DEFAULT 'Pending',
ADD COLUMN shop_verified boolean DEFAULT false,
ADD COLUMN identity_verified boolean DEFAULT false,
ADD COLUMN address_verified boolean DEFAULT false,
ADD COLUMN signboard_verified boolean DEFAULT false;

ALTER TABLE follow_ups
ADD COLUMN status text DEFAULT 'Scheduled',
ADD COLUMN remarks text;


ALTER TABLE public.territories
ADD COLUMN lead_id uuid REFERENCES public.leads(id);

ALTER TABLE public.territories
ADD COLUMN reserved_by text;

ALTER TABLE public.territories
ADD COLUMN reserved_at timestamptz;
ALTER TABLE profiles
ADD COLUMN role text DEFAULT 'lead_executive';