import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { PortfolioContent } from '../config/content';
import { INITIAL_PORTFOLIO_CONTENT } from '../config/content';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY = 'illusive_studio_cms_data_v2';

/**
 * Loads content either from Supabase table or local storage cache
 */
export async function loadPortfolioContent(): Promise<PortfolioContent> {
  // Check local cache first
  const localData = localStorage.getItem(STORAGE_KEY);
  let content = INITIAL_PORTFOLIO_CONTENT;

  if (localData) {
    try {
      content = { ...INITIAL_PORTFOLIO_CONTENT, ...JSON.parse(localData) };
    } catch (e) {
      console.warn('Failed to parse local portfolio content:', e);
    }
  }

  // If Supabase is connected, attempt to fetch live remote content
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('content')
        .single();

      if (!error && data?.content) {
        content = { ...content, ...data.content };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to cached content:', err);
    }
  }

  return content;
}

/**
 * Saves updated content to Supabase and local cache
 */
export async function savePortfolioContent(updated: PortfolioContent): Promise<{ success: boolean; error?: string }> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (supabase) {
      const { error } = await supabase
        .from('portfolio_content')
        .upsert({ id: 'primary', content: updated, updated_at: new Date().toISOString() });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Trigger Supabase Google OAuth
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Checks if the current user session is authorized
 */
export function isAuthorizedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === INITIAL_PORTFOLIO_CONTENT.authorizedEmail.toLowerCase();
}
