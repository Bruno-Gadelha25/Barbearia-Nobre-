import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const isPlaceholderValue = (value: string) =>
  /^(seu_|sua_|your_|example|placeholder|<.*>)/i.test(value) ||
  value.includes('supabase') && !value.includes('http');

const isHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = isHttpUrl(supabaseUrl) && !isPlaceholderValue(supabaseAnonKey);

const createDisabledClient = () =>
  ({
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: new Error('Supabase não configurado'),
      }),
      signOut: async () => ({ error: null }),
    },
  } as const);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (createDisabledClient() as unknown as ReturnType<typeof createClient>);
