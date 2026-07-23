import { supabase } from './supabase'

export async function loadPageContent<T>(key: string, defaultVal: T): Promise<T> {
  // 1. Try to load from Supabase with a 3-second timeout to avoid long UI freezes
  try {
    const supabasePromise = supabase
      .from('flux_page_contents')
      .select('content')
      .eq('page_key', key)
      .single()

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase fetch timed out')), 3000)
    )

    const { data, error } = await Promise.race([supabasePromise, timeoutPromise])
    
    if (!error && data?.content) {
      return data.content as T
    }
  } catch (e) {
    console.warn(`Supabase load failed for key ${key}:`, e)
  }

  // 2. Try to load from localStorage
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(`flux-page-${key}`)
    if (local) {
      try {
        return JSON.parse(local) as T
      } catch (e) {
        console.error(`Error parsing local storage for key ${key}:`, e)
      }
    }
  }

  // 3. Fall back to default
  return defaultVal
}

export async function savePageContent<T>(key: string, content: T): Promise<boolean> {
  // 1. Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`flux-page-${key}`, JSON.stringify(content))
  }

  // 2. Save to Supabase
  try {
    const { error } = await supabase
      .from('flux_page_contents')
      .upsert({
        page_key: key,
        content: content as any,
        updated_at: new Date().toISOString()
      }, { onConflict: 'page_key' })
    
    if (error) {
      console.warn(`Supabase save failed for key ${key} (will use localStorage fallback):`, error.message)
      return false
    }
    return true
  } catch (e) {
    console.warn(`Supabase upsert exception for key ${key}:`, e)
    return false
  }
}
