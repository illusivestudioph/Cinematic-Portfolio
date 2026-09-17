import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveScene, type SceneConfig } from '../config/timeline';
import type { PortfolioContent, ProjectItem } from '../config/content';
import { INITIAL_PORTFOLIO_CONTENT } from '../config/content';

import { loadPortfolioContent, savePortfolioContent, isAuthorizedEmail, supabase } from '../lib/supabase';

interface PortfolioContextType {
  progress: number;
  setProgress: (p: number) => void;
  activeScene: SceneConfig;
  content: PortfolioContent;
  updateContent: (newContent: PortfolioContent) => Promise<boolean>;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isReelPlaying: boolean;
  setIsReelPlaying: (playing: boolean) => void;
  activeModalProject: ProjectItem | null;
  setActiveModalProject: (project: ProjectItem | null) => void;
  developerClicks: number;
  handleDeveloperClick: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAuthenticatedAdmin: boolean;
  setIsAuthenticatedAdmin: (authed: boolean) => void;
  scrollPaused: boolean;
  setScrollPaused: (paused: boolean) => void;
  userEmail: string | null;
  signOutAdmin: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState<PortfolioContent>(INITIAL_PORTFOLIO_CONTENT);
  const [isMuted, setIsMuted] = useState(true);
  const [isReelPlaying, setIsReelPlaying] = useState(false);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [developerClicks, setDeveloperClicks] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [scrollPaused, setScrollPaused] = useState(false);

  const activeScene = getActiveScene(progress);

  // Load content on mount
  useEffect(() => {
    loadPortfolioContent().then((loaded) => {
      setContent(loaded);
    });

    // Check existing Supabase session if configured
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          const email = session.user.email;
          setUserEmail(email);
          if (isAuthorizedEmail(email)) {
            setIsAuthenticatedAdmin(true);
          }
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        const email = session?.user?.email;
        setUserEmail(email || null);
        if (isAuthorizedEmail(email)) {
          setIsAuthenticatedAdmin(true);
        } else {
          setIsAuthenticatedAdmin(false);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const handleDeveloperClick = () => {
    const nextCount = developerClicks + 1;
    setDeveloperClicks(nextCount);
    if (nextCount >= 5) {
      setIsAdminOpen(true);
      setDeveloperClicks(0);
    }
  };

  const updateContent = async (newContent: PortfolioContent): Promise<boolean> => {
    const res = await savePortfolioContent(newContent);
    if (res.success) {
      setContent(newContent);
      return true;
    }
    return false;
  };

  const signOutAdmin = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticatedAdmin(false);
    setUserEmail(null);
  };

  return (
    <PortfolioContext.Provider
      value={{
        progress,
        setProgress,
        activeScene,
        content,
        updateContent,
        isMuted,
        setIsMuted,
        isReelPlaying,
        setIsReelPlaying,
        activeModalProject,
        setActiveModalProject,
        developerClicks,
        handleDeveloperClick,
        isAdminOpen,
        setIsAdminOpen,
        isAuthenticatedAdmin,
        setIsAuthenticatedAdmin,
        scrollPaused,
        setScrollPaused,
        userEmail,
        signOutAdmin,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
