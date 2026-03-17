/**
 * TypeScript types derived from schema.sql.
 * Keep in sync with Supabase public schema.
 *
 * Usage:
 *   import type { Database } from "@/lib/types/database";
 *   import type { Profile, Customer, Job, ReviewRequest } from "@/lib/types/database";
 */

// ─── Row types (what you get back from SELECT) ───────────────────────────────

export interface Profile {
  id: string; // uuid — matches auth.users.id
  email: string;
  full_name: string | null;
  business_name: string | null;
  google_review_url: string | null;
  delay_hours: number; // default: 2
  // Polar.sh subscription tracking
  subscription_tier: string; // 'free' | 'starter' | 'pro'
  subscription_status: string; // 'active' | 'canceled' | 'past_due'
  polar_customer_id: string | null;
  polar_subscription_id: string | null;
  subscription_current_period_end: string | null; // ISO 8601 timestamptz
}

export interface Customer {
  id: string; // uuid
  user_id: string; // → profiles.id
  name: string;
  email: string | null;
  phone: string | null;
}

export type JobStatus = "completed" | "review_sent" | "reviewed";

export interface Job {
  id: string; // uuid
  user_id: string; // → profiles.id
  customer_id: string; // → customers.id
  service_type: string;
  completed_at: string | null; // ISO 8601 timestamptz
  status: JobStatus;
  notes: string | null;
}

export type ReviewRequestStatus =
  | "pending"
  | "sent"
  | "failed"
  | "clicked"
  | "reviewed";

export interface ReviewRequest {
  id: string; // uuid
  job_id: string; // → jobs.id
  scheduled_at: string | null; // ISO 8601 timestamptz
  sent_at: string | null; // ISO 8601 timestamptz
  status: ReviewRequestStatus;
}

// ─── Insert types (omit auto-generated fields) ───────────────────────────────

export type ProfileInsert = Omit<
  Profile,
  | "delay_hours"
  | "subscription_tier"
  | "subscription_status"
  | "polar_customer_id"
  | "polar_subscription_id"
  | "subscription_current_period_end"
> & {
  delay_hours?: number;
  subscription_tier?: string;
  subscription_status?: string;
  polar_customer_id?: string | null;
  polar_subscription_id?: string | null;
  subscription_current_period_end?: string | null;
};

export type CustomerInsert = Omit<Customer, "id">;

export type JobInsert = Omit<Job, "id">;

export type ReviewRequestInsert = Omit<ReviewRequest, "id">;

// ─── Supabase Database generic type (for createClient<Database>()) ───────────
// Each table entry must include Row, Insert, Update, AND Relationships to
// satisfy the GenericTable constraint in @supabase/postgrest-js. Without
// Relationships the Insert type resolves to `never` on upsert/insert calls.
// Views, Functions, and Enums are required by GenericSchema; empty is fine.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
        Relationships: [];
      };
      customers: {
        Row: Customer;
        Insert: CustomerInsert;
        Update: Partial<CustomerInsert>;
        Relationships: [];
      };
      jobs: {
        Row: Job;
        Insert: JobInsert;
        Update: Partial<JobInsert>;
        Relationships: [];
      };
      review_requests: {
        Row: ReviewRequest;
        Insert: ReviewRequestInsert;
        Update: Partial<ReviewRequestInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
