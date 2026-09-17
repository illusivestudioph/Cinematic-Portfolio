-- 1. Create the portfolio_content table
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read portfolio content (public view)
CREATE POLICY "Public can view portfolio content"
  ON public.portfolio_content
  FOR SELECT
  USING (true);

-- Policy: Only authorized email can insert/update portfolio content
CREATE POLICY "Authorized users can update portfolio content"
  ON public.portfolio_content
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'yhanlhester@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'yhanlhester@gmail.com'
  );

-- Policy: Allow anon to update if matching secret or during initial setup if desired
-- (Optional fallback for initial seeding)
CREATE POLICY "Anon initial seed fallback"
  ON public.portfolio_content
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. Storage Buckets Setup
-- Insert 'sequences' and 'videos' storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('sequences', 'sequences', true),
  ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view sequence frames and videos publicly
CREATE POLICY "Public Access Sequences"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('sequences', 'videos'));

-- Policy: Authorized email can upload/manage sequences and videos
CREATE POLICY "Authorized Upload Sequences"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('sequences', 'videos') AND 
    auth.jwt() ->> 'email' = 'yhanlhester@gmail.com'
  );

CREATE POLICY "Authorized Manage Sequences"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id IN ('sequences', 'videos') AND 
    auth.jwt() ->> 'email' = 'yhanlhester@gmail.com'
  );
