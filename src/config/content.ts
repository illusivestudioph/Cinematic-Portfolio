export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  role: string;
  tools: string[];
  videoUrl: string;
  thumbnailUrl: string;
  aspectRatio: string;
  metrics?: { label: string; value: string }[];
}

export interface ProcessStage {
  id: string;
  step: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  visualMetric: string;
}

import studioOpening from '../assets/studio-opening.jpg';
import editorLook from '../assets/editor-look.jpg';
import editorOts from '../assets/editor-ots.jpg';
import timelineCloseup from '../assets/timeline-closeup.jpg';
import footageGraded from '../assets/footage-graded.jpg';

/**
 * One ~8s source clip inside a scroll-controlled cinematic movement.
 * An 8-second clip never covers an entire beat — beats chain multiple clips.
 * Each clip is its own Supabase-hosted WebP frame sequence with an
 * independent frame count (never assume a fixed number).
 */
export interface FrameSequenceClip {
  label: string;      // Movement label, e.g. "PULL UP CHAIR"
  baseUrl: string;    // Supabase folder: {baseUrl}/frame_0001.webp ...
  frameCount: number; // Per-clip frame count
  padding: number;    // Zero-padding digits (4 = 0001)
  fallback: string;   // Still frame shown until sequence frames load
}

export interface PortfolioContent {
  studioName: string;
  tagline: string;
  authorizedEmail: string;

  // Beat 01 opening portrait — single WebP sequence (frame 1 = the still)
  editorSequence: {
    baseUrl: string;
    frameCount: number;
    padding: number;
    fallback: string;
  };

  // Beat 02 — chained source clips: blink -> break pose -> approach -> chair -> sit
  breakFrame: {
    clips: FrameSequenceClip[];
  };

  // Beat 03 — chained camera-move clips: OTS push -> monitor approach -> timeline
  catalyst: {
    clips: FrameSequenceClip[];
  };

  // Beat 04 Showreel (real MP4, audio preserved)
  showreel: {
    title: string;
    subtitle: string;
    duration: string;
    videoUrl: string;
    posterUrl: string;
    aspectRatio: string;
  };

  // Scene 09 Projects
  projects: ProjectItem[];

  // Scene 10 Process
  processStages: ProcessStage[];

  // Scene 11 About
  about: {
    title: string;
    headline: string;
    bio: string[];
    philosophy: string;
    stats: { label: string; value: string }[];
    software: string[];
  };

  // Scene 12 Contact
  contact: {
    headline: string;
    subheadline: string;
    ctaButtonText: string;
    email: string;
    instagram: string;
    twitter: string;
    vimeo: string;
    availability: string;
  };
}

export const INITIAL_PORTFOLIO_CONTENT: PortfolioContent = {
  studioName: "ILLUSIVE STUDIO",
  tagline: "CINEMATIC NARRATIVE & COMMERCIAL EDITING",
  authorizedEmail: "yhanlhester@gmail.com",

  editorSequence: {
    // Configurable Supabase WebP sequence endpoint. Empty by default to use the
    // cinematic studio still. When set, frame 0001 becomes the static portrait
    // and Beat 01 scrubs gently inside the opening composition.
    baseUrl: "",
    frameCount: 120,
    padding: 4,
    fallback: studioOpening,
  },

  breakFrame: {
    // Multiple ~8s source clips chained into one continuous movement.
    // Leave baseUrl empty to use the procedural choreography set.
    clips: [
      { label: "BLINK", baseUrl: "", frameCount: 90, padding: 4, fallback: editorLook },
      { label: "BREAK POSE", baseUrl: "", frameCount: 90, padding: 4, fallback: studioOpening },
      { label: "MOVE TO WORKSTATION", baseUrl: "", frameCount: 110, padding: 4, fallback: studioOpening },
      { label: "PULL UP CHAIR", baseUrl: "", frameCount: 100, padding: 4, fallback: editorOts },
      { label: "SIT & SETTLE", baseUrl: "", frameCount: 120, padding: 4, fallback: editorOts },
    ],
  },

  catalyst: {
    // Several camera-move clips: over-the-shoulder -> push to monitor -> timeline.
    clips: [
      { label: "OVER-THE-SHOULDER PUSH", baseUrl: "", frameCount: 120, padding: 4, fallback: editorOts },
      { label: "PUSH TOWARD MONITOR", baseUrl: "", frameCount: 110, padding: 4, fallback: editorOts },
      { label: "TIMELINE ACTIVATION", baseUrl: "", frameCount: 100, padding: 4, fallback: timelineCloseup },
    ],
  },

  showreel: {
    title: "ILLUSIVE STUDIO // MASTER EDITORIAL REEL",
    subtitle: "Narrative, Commercial, High-Energy Pacing",
    duration: "01:45",
    // High quality editorial showreel video (royalty-free cinematic reel stream)
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    posterUrl: footageGraded,
    aspectRatio: "16:9",
  },

  projects: [
    {
      id: "crimexbt",
      title: "CRIMEXBT",
      client: "CRIME ENTERTAINMENT",
      category: "Narrative / Commercial Trailer",
      year: "2025",
      description: "High-octane cutting, aggressive micro-match cuts, atmospheric sub-bass audio sound design, and razor-sharp pacing for the CRIMEXBT brand identity film.",
      role: "Lead Editor, Sound Design & Color Grade",
      tools: ["Premiere Pro", "DaVinci Resolve", "Soundly", "After Effects"],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1280&q=80",
      aspectRatio: "16:9",
      metrics: [
        { label: "Cut Count", value: "248 Cuts" },
        { label: "Pacing Peak", value: "18 Cuts/Sec" },
        { label: "Audio Stems", value: "64 Tracks" },
      ],
    },
    {
      id: "apex-overdrive",
      title: "APEX // OVERDRIVE",
      client: "HYPERION AUTOMOTIVE",
      category: "Hyper-Speed Commercial",
      year: "2025",
      description: "Kinetic automotive showcase engineered with rhythmic speed ramps, whip pans, engine frequency matching, and high-contrast anamorphic color science.",
      role: "Editor & Motion Sound Designer",
      tools: ["DaVinci Resolve", "Avid Media Composer"],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1280&q=80",
      aspectRatio: "16:9",
      metrics: [
        { label: "Camera", value: "RED V-Raptor" },
        { label: "Dynamic Range", value: "16+ Stops" },
        { label: "FPS Variations", value: "24 to 120fps" },
      ],
    },
    {
      id: "sub-zero",
      title: "SUB-ZERO NOCTURNE",
      client: "NEO TOKYO MUSIC",
      category: "Cinematic Music Video",
      year: "2024",
      description: "Ethereal, rhythmic psychological visual piece interweaving raw handheld grit with meticulously synchronized beat-drops and split-second strobe montages.",
      role: "Creative Director & Lead Editor",
      tools: ["Premiere Pro", "DaVinci Resolve", "Dehancer Pro"],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80",
      aspectRatio: "2.39:1",
      metrics: [
        { label: "Format", value: "35mm Anamorphic" },
        { label: "BPM Lock", value: "134 BPM" },
        { label: "Color Space", value: "ACEScct" },
      ],
    },
  ],

  processStages: [
    {
      id: "raw",
      step: "01",
      title: "RAW INGEST & SELECTS",
      tagline: "Mining the golden frames from terabytes of chaos",
      description: "Stringent logging, multi-angle sync, and identifying raw emotion before a single cut is made on the master timeline.",
      deliverables: ["Metadata Tagging", "Director Pulls", "Subclip Selects Reel"],
      visualMetric: "12TB Raw 8K",
    },
    {
      id: "edit",
      step: "02",
      title: "THE ASSEMBLY & RHYTHM",
      tagline: "Carving narrative tension frame by frame",
      description: "Pacing is emotion. Constructing the initial rough assembly, then dialing in timing, micro-trims, and seamless visual flow.",
      deliverables: ["Rough Cut", "Director Cut", "Micro-Trim Polish"],
      visualMetric: "24.000 FPS Lock",
    },
    {
      id: "motion",
      step: "03",
      title: "KINETIC MOTION & VFX",
      tagline: "Seamless typography, speed ramps, and invisible transitions",
      description: "Seamless screen replacements, matte painting, optical flow ramping, and title design integrated directly into the cut.",
      deliverables: ["Speed Ramps", "Graphics Packaging", "Invisible Cleanups"],
      visualMetric: "60+ VFX Nodes",
    },
    {
      id: "sound",
      step: "04",
      title: "SOUND DESIGN & FOLEY",
      tagline: "Audio is 70% of the cinematic immersion",
      description: "Multi-layered whooshes, risers, impact sub-booms, atmospheric foley, and surgical EQ carving for punchy delivery.",
      deliverables: ["Dolby 5.1 / Stereo Stems", "Custom Risers", "Dynamic Limiting"],
      visualMetric: "-14 LUFS Integrated",
    },
    {
      id: "color",
      step: "05",
      title: "COLOR GRADE & TEXTURE",
      tagline: "Color science that evokes immediate psychology",
      description: "Shot-to-shot balance, skin-tone isolation, custom film print emulation (Kodak 2383 / 5219), and halation diffusion.",
      deliverables: ["ACES Color Pipeline", "Custom LUTs", "Halation & Grain"],
      visualMetric: "DCI-P3 & Rec.709",
    },
    {
      id: "final",
      step: "06",
      title: "MASTER DELIVERY",
      tagline: "Pristine multi-platform delivery ready for theatrical and web",
      description: "ProRes 4444 XQ master archival, optimized web deliverables, broadcast safe legalizing, and international clean tracks.",
      deliverables: ["ProRes 4444 Master", "Social Aspect Cuts (9:16, 4:5)", "Stem Archives"],
      visualMetric: "10-bit 4:4:4 Uncompressed",
    },
  ],

  about: {
    title: "THE EDITOR BEHIND THE TIMELINE",
    headline: "Every cut is a decision of empathy, rhythm, and unspoken narrative.",
    bio: [
      "I am a specialized commercial and narrative video editor obsessed with the psychology of pacing. For over 8 years, I have constructed high-impact edits that capture attention within the first 3 frames and never let go.",
      "Working seamlessly with directors, agencies, and independent creators globally, my focus is bridging raw footage into gripping visual journeys that feel effortless yet meticulously engineered down to the millisecond.",
    ],
    philosophy: "Great editing isn't noticed as technique; it is felt as pulse.",
    stats: [
      { label: "Completed Edits", value: "280+" },
      { label: "Commercial Views", value: "50M+" },
      { label: "Turnaround Speed", value: "24-48h" },
      { label: "Coffee Consumed", value: "∞" },
    ],
    software: ["DaVinci Resolve Studio", "Adobe Premiere Pro", "After Effects", "Avid Media Composer", "Dehancer", "Izotope RX"],
  },

  contact: {
    headline: "GOT FOOTAGE?",
    subheadline: "LET'S MAKE SOMETHING OUT OF IT.",
    ctaButtonText: "START A PROJECT",
    email: "yhanlhester@gmail.com",
    instagram: "https://instagram.com/illusivestudio",
    twitter: "https://x.com/illusivestudio",
    vimeo: "https://vimeo.com/illusivestudio",
    availability: "Accepting Q3 / Q4 Select Projects",
  },
};
