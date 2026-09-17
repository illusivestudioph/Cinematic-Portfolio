-- ==============================================================================
-- ILLUSIVE STUDIO — SUPABASE COMPLETE DATABASE SETUP SCRIPT
-- Project: cvpunprngqlugzmnjoen
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cvpunprngqlugzmnjoen/sql/new
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE: portfolio_content (Master CMS state for all 7 beats & configuration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. TABLE: contact_inquiries (Stores inquiries from Beat 06 CTA Anchor)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT NOT NULL,
  project_type TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived'))
);

-- ==============================================================================
-- 4. TABLE: media_sequences (Optional catalog for WebP sequence assets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beat_code TEXT NOT NULL, -- '01', '02', '03', '05', '06', '07'
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  frame_count INTEGER NOT NULL DEFAULT 120,
  padding INTEGER NOT NULL DEFAULT 4,
  fallback_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_sequences ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 6. RLS POLICIES
-- ==============================================================================

-- PORTFOLIO_CONTENT: Public read, only yhanlhester@gmail.com can write
DROP POLICY IF EXISTS "Public can view portfolio content" ON public.portfolio_content;
CREATE POLICY "Public can view portfolio content"
  ON public.portfolio_content
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authorized users can update portfolio content" ON public.portfolio_content;
CREATE POLICY "Authorized users can update portfolio content"
  ON public.portfolio_content
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'yhanlhester@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'yhanlhester@gmail.com');

-- CONTACT_INQUIRIES: Anyone can submit an inquiry, only authorized user can read
DROP POLICY IF EXISTS "Public can insert contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Public can insert contact inquiries"
  ON public.contact_inquiries
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authorized can view contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Authorized can view contact inquiries"
  ON public.contact_inquiries
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'yhanlhester@gmail.com');

-- MEDIA_SEQUENCES: Public read, authorized write
DROP POLICY IF EXISTS "Public can view sequences" ON public.media_sequences;
CREATE POLICY "Public can view sequences"
  ON public.media_sequences
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authorized can manage sequences" ON public.media_sequences;
CREATE POLICY "Authorized can manage sequences"
  ON public.media_sequences
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'yhanlhester@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'yhanlhester@gmail.com');

-- ==============================================================================
-- 7. STORAGE BUCKETS (Public CDN for WebP sequence frames and MP4 videos)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('sequences', 'sequences', true),
  ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
DROP POLICY IF EXISTS "Public View Sequences and Videos" ON storage.objects;
CREATE POLICY "Public View Sequences and Videos"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('sequences', 'videos'));

DROP POLICY IF EXISTS "Authorized Manage Sequences and Videos" ON storage.objects;
CREATE POLICY "Authorized Manage Sequences and Videos"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id IN ('sequences', 'videos') AND 
    auth.jwt() ->> 'email' = 'yhanlhester@gmail.com'
  )
  WITH CHECK (
    bucket_id IN ('sequences', 'videos') AND 
    auth.jwt() ->> 'email' = 'yhanlhester@gmail.com'
  );

-- ==============================================================================
-- 8. INITIAL SEED DATA FOR THE 7-BEAT CINEMATIC FLOW
-- ==============================================================================
INSERT INTO public.portfolio_content (id, content, updated_at)
VALUES (
  'primary',
  '{
    "studioName": "ILLUSIVE STUDIO",
    "tagline": "CINEMATIC NARRATIVE & COMMERCIAL EDITING",
    "authorizedEmail": "yhanlhester@gmail.com",
    "showreel": {
      "title": "ILLUSIVE STUDIO // MASTER EDITORIAL REEL",
      "subtitle": "Narrative, Commercial, High-Energy Pacing",
      "duration": "01:45",
      "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      "posterUrl": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=85",
      "aspectRatio": "16:9"
    },
    "sequences": {
      "beat01Static": {
        "baseUrl": "",
        "frameCount": 120,
        "padding": 4,
        "fallback": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=85"
      },
      "beat02BreakFrame": {
        "baseUrl": "",
        "frameCount": 120,
        "padding": 4,
        "fallback": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85"
      },
      "beat03Catalyst": {
        "baseUrl": "",
        "frameCount": 120,
        "padding": 4,
        "fallback": "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1920&q=85"
      },
      "beat05Deconstruction": {
        "baseUrl": "",
        "frameCount": 140,
        "padding": 4,
        "fallback": "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1920&q=85"
      },
      "beat06CTAAnchor": {
        "baseUrl": "",
        "frameCount": 120,
        "padding": 4,
        "fallback": "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1920&q=85"
      },
      "beat07FooterFade": {
        "baseUrl": "",
        "frameCount": 100,
        "padding": 4,
        "fallback": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=85"
      }
    },
    "projects": [
      {
        "id": "crimexbt",
        "title": "CRIMEXBT",
        "client": "CRIME ENTERTAINMENT",
        "category": "Narrative / Commercial Trailer",
        "year": "2025",
        "description": "High-octane cutting, aggressive micro-match cuts, atmospheric sub-bass audio sound design, and razor-sharp pacing for the CRIMEXBT brand identity film.",
        "role": "Lead Editor, Sound Design & Color Grade",
        "tools": ["Premiere Pro", "DaVinci Resolve", "Soundly", "After Effects"],
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        "thumbnailUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1280&q=80",
        "aspectRatio": "16:9",
        "metrics": [
          { "label": "Cut Count", "value": "248 Cuts" },
          { "label": "Pacing Peak", "value": "18 Cuts/Sec" },
          { "label": "Audio Stems", "value": "64 Tracks" }
        ]
      }
    ],
    "contact": {
      "headline": "LET’S SHAPE YOUR NARRATIVE",
      "subheadline": "AVAILABLE FOR DIRECTORS, PRODUCTION HOUSES & COMMERCIAL BRANDS",
      "ctaButtonText": "START A PROJECT",
      "email": "yhanlhester@gmail.com",
      "instagram": "https://instagram.com/illusivestudio.ph",
      "twitter": "https://x.com/illusivestudio",
      "vimeo": "https://vimeo.com/illusivestudio",
      "availability": "ACCEPTING PROJECTS // Q1-Q2 2026"
    }
  }'::jsonb,
  timezone('utc'::text, now())
)
ON CONFLICT (id) DO NOTHING;
