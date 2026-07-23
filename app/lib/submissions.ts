import { supabase } from "./supabase"

export const submissionTables = {
  teamRegistrations: "team_registrations",
  eventRegistrations: "event_registrations",
  communityRequests: "community_requests",
  contactMessages: "contact_messages",
  sponsorRequests: "sponsor_requests",
  workshopRsvps: "workshop_rsvps",
} as const

export type SubmissionTable = typeof submissionTables[keyof typeof submissionTables]

export async function loadSubmissions<T>(table: SubmissionTable): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("timestamp", { ascending: false })

  if (error) {
    console.warn(`Supabase load failed for ${table}:`, error.message)
    return []
  }

  return (data || []) as T[]
}

export async function saveSubmission<T>(
  table: SubmissionTable,
  payload: T
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .insert([payload as any])
    .select()
    .single()

  if (error) {
    console.warn(`Supabase insert failed for ${table}:`, error.message)
    return null
  }

  return data as T
}

export async function deleteSubmissionById(table: SubmissionTable, id: string): Promise<boolean> {
  const { error } = await supabase.from(table).delete().eq("id", id)

  if (error) {
    console.warn(`Supabase delete failed for ${table}:`, error.message)
    return false
  }

  return true
}
