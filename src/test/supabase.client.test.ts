import { describe, expect, it } from 'vitest';
import { supabase } from '../integrations/supabase/client';

describe('supabase client', () => {
  it('falls back to a safe stub when env vars are missing', async () => {
    const result = await supabase.from('site_settings').select('key, value');

    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
  });
});
