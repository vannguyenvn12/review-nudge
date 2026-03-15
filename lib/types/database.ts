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

export type ProfileInsert = Omit<Profile, "delay_hours"> & {
  delay_hours?: number;
};

export type CustomerInsert = Omit<Customer, "id">;

export type JobInsert = Omit<Job, "id">;

export type ReviewRequestInsert = Omit<ReviewRequest, "id">;

// ─── Supabase Database generic type (for createClient<Database>()) ───────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
      };
      customers: {
        Row: Customer;
        Insert: CustomerInsert;
        Update: Partial<CustomerInsert>;
      };
      jobs: {
        Row: Job;
        Insert: JobInsert;
        Update: Partial<JobInsert>;
      };
      review_requests: {
        Row: ReviewRequest;
        Insert: ReviewRequestInsert;
        Update: Partial<ReviewRequestInsert>;
      };
    };
  };
}
