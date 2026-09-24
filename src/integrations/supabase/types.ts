export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointment_letters: {
        Row: {
          created_at: string
          effective_date: string | null
          expiry_date: string | null
          id: string
          issued_at: string | null
          issued_by: string | null
          lead_id: string | null
          letter_number: string
          partner_id: string | null
          pdf_hash: string | null
          pdf_path: string | null
          previous_letter_id: string | null
          qr_token: string
          revocation_reason: string | null
          revoked_at: string | null
          revoked_by: string | null
          signatory: string | null
          signature_digest: string | null
          snapshot: Json
          status: string
          template_id: string | null
        }
        Insert: {
          created_at?: string
          effective_date?: string | null
          expiry_date?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          lead_id?: string | null
          letter_number?: string
          partner_id?: string | null
          pdf_hash?: string | null
          pdf_path?: string | null
          previous_letter_id?: string | null
          qr_token?: string
          revocation_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          signatory?: string | null
          signature_digest?: string | null
          snapshot?: Json
          status?: string
          template_id?: string | null
        }
        Update: {
          created_at?: string
          effective_date?: string | null
          expiry_date?: string | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          lead_id?: string | null
          letter_number?: string
          partner_id?: string | null
          pdf_hash?: string | null
          pdf_path?: string | null
          previous_letter_id?: string | null
          qr_token?: string
          revocation_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          signatory?: string | null
          signature_digest?: string | null
          snapshot?: Json
          status?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_letters_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_letters_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_letters_previous_letter_id_fkey"
            columns: ["previous_letter_id"]
            isOneToOne: false
            referencedRelation: "appointment_letters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_letters_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "letter_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          conditions: string | null
          created_at: string
          decided_by: string | null
          decision: string
          id: string
          lead_id: string
          remarks: string | null
          signature: string | null
          signature_digest: string | null
          signed_at: string | null
        }
        Insert: {
          conditions?: string | null
          created_at?: string
          decided_by?: string | null
          decision: string
          id?: string
          lead_id: string
          remarks?: string | null
          signature?: string | null
          signature_digest?: string | null
          signed_at?: string | null
        }
        Update: {
          conditions?: string | null
          created_at?: string
          decided_by?: string | null
          decision?: string
          id?: string
          lead_id?: string
          remarks?: string | null
          signature?: string | null
          signature_digest?: string | null
          signed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approvals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          id: string
          module: string
          reason: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          id?: string
          module: string
          reason?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          id?: string
          module?: string
          reason?: string | null
        }
        Relationships: []
      }
      banks: {
        Row: {
          code: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          code: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      document_reviews: {
        Row: {
          checklist: Json
          comment: string | null
          created_at: string
          decision: string
          document_id: string
          duplicate_matches: Json
          id: string
          lead_id: string
          reason_code: string | null
          reviewed_by: string
        }
        Insert: {
          checklist?: Json
          comment?: string | null
          created_at?: string
          decision: string
          document_id: string
          duplicate_matches?: Json
          id?: string
          lead_id: string
          reason_code?: string | null
          reviewed_by: string
        }
        Update: {
          checklist?: Json
          comment?: string | null
          created_at?: string
          decision?: string
          document_id?: string
          duplicate_matches?: Json
          id?: string
          lead_id?: string
          reason_code?: string | null
          reviewed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_reviews_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_reviews_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content_hash: string | null
          created_at: string
          doc_type: string
          expires_on: string | null
          file_name: string | null
          file_path: string | null
          id: string
          lead_id: string
          mime_type: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_comment: string | null
          status: string
          supersedes_id: string | null
          uploaded_by: string | null
          version: number
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          doc_type: string
          expires_on?: string | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          lead_id: string
          mime_type?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_comment?: string | null
          status?: string
          supersedes_id?: string | null
          uploaded_by?: string | null
          version?: number
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          doc_type?: string
          expires_on?: string | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          lead_id?: string
          mime_type?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_comment?: string | null
          status?: string
          supersedes_id?: string | null
          uploaded_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_supersedes_id_fkey"
            columns: ["supersedes_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      due_diligence: {
        Row: {
          biometric: string | null
          computer: string | null
          created_at: string
          created_by: string | null
          electricity: string | null
          id: string
          inspector: string | null
          internet: string | null
          lat: number | null
          lead_id: string
          lng: number | null
          notes: string | null
          printer: string | null
          recommendation: string | null
          risk: string | null
          security: string | null
          visit_date: string | null
        }
        Insert: {
          biometric?: string | null
          computer?: string | null
          created_at?: string
          created_by?: string | null
          electricity?: string | null
          id?: string
          inspector?: string | null
          internet?: string | null
          lat?: number | null
          lead_id: string
          lng?: number | null
          notes?: string | null
          printer?: string | null
          recommendation?: string | null
          risk?: string | null
          security?: string | null
          visit_date?: string | null
        }
        Update: {
          biometric?: string | null
          computer?: string | null
          created_at?: string
          created_by?: string | null
          electricity?: string | null
          id?: string
          inspector?: string | null
          internet?: string | null
          lat?: number | null
          lead_id?: string
          lng?: number | null
          notes?: string | null
          printer?: string | null
          recommendation?: string | null
          risk?: string | null
          security?: string | null
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "due_diligence_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          assigned_to: string | null
          completed: boolean
          created_at: string
          id: string
          lead_id: string
          notes: string | null
          outcome: string | null
          scheduled_at: string
          task_type: string
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          lead_id: string
          notes?: string | null
          outcome?: string | null
          scheduled_at?: string
          task_type?: string
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
          outcome?: string | null
          scheduled_at?: string
          task_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      geographies: {
        Row: {
          code: string | null
          created_at: string
          id: string
          is_active: boolean
          level: string
          name: string
          parent_id: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          level: string
          name: string
          parent_id?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          level?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "geographies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "geographies"
            referencedColumns: ["id"]
          },
        ]
      }
      import_batches: {
        Row: {
          created_at: string
          created_by: string | null
          error_rows: number
          errors: Json
          file_name: string
          id: string
          module: string
          status: string
          total_rows: number
          valid_rows: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          error_rows?: number
          errors?: Json
          file_name: string
          id?: string
          module?: string
          status?: string
          total_rows?: number
          valid_rows?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          error_rows?: number
          errors?: Json
          file_name?: string
          id?: string
          module?: string
          status?: string
          total_rows?: number
          valid_rows?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          alt_mobile: string | null
          applicant_name: string
          bank_id: string | null
          completeness: number
          consent: boolean
          created_at: string
          created_by: string | null
          dob: string | null
          education: string | null
          email: string | null
          entity_type: string | null
          experience: string | null
          father_name: string | null
          gender: string | null
          id: string
          landmark: string | null
          lead_code: string
          lead_score: number
          lead_type: string
          mobile: string | null
          next_follow_up: string | null
          outlet_address: string | null
          outlet_block: string | null
          outlet_district: string | null
          outlet_lat: number | null
          outlet_lng: number | null
          outlet_name: string | null
          outlet_pin: string | null
          outlet_state: string | null
          owner_id: string | null
          priority: string
          program_id: string | null
          res_address: string | null
          res_block: string | null
          res_district: string | null
          res_pin: string | null
          res_state: string | null
          res_village: string | null
          source: string | null
          status: string
          territory_id: string | null
          updated_at: string
        }
        Insert: {
          alt_mobile?: string | null
          applicant_name: string
          bank_id?: string | null
          completeness?: number
          consent?: boolean
          created_at?: string
          created_by?: string | null
          dob?: string | null
          education?: string | null
          email?: string | null
          entity_type?: string | null
          experience?: string | null
          father_name?: string | null
          gender?: string | null
          id?: string
          landmark?: string | null
          lead_code?: string
          lead_score?: number
          lead_type?: string
          mobile?: string | null
          next_follow_up?: string | null
          outlet_address?: string | null
          outlet_block?: string | null
          outlet_district?: string | null
          outlet_lat?: number | null
          outlet_lng?: number | null
          outlet_name?: string | null
          outlet_pin?: string | null
          outlet_state?: string | null
          owner_id?: string | null
          priority?: string
          program_id?: string | null
          res_address?: string | null
          res_block?: string | null
          res_district?: string | null
          res_pin?: string | null
          res_state?: string | null
          res_village?: string | null
          source?: string | null
          status?: string
          territory_id?: string | null
          updated_at?: string
        }
        Update: {
          alt_mobile?: string | null
          applicant_name?: string
          bank_id?: string | null
          completeness?: number
          consent?: boolean
          created_at?: string
          created_by?: string | null
          dob?: string | null
          education?: string | null
          email?: string | null
          entity_type?: string | null
          experience?: string | null
          father_name?: string | null
          gender?: string | null
          id?: string
          landmark?: string | null
          lead_code?: string
          lead_score?: number
          lead_type?: string
          mobile?: string | null
          next_follow_up?: string | null
          outlet_address?: string | null
          outlet_block?: string | null
          outlet_district?: string | null
          outlet_lat?: number | null
          outlet_lng?: number | null
          outlet_name?: string | null
          outlet_pin?: string | null
          outlet_state?: string | null
          owner_id?: string | null
          priority?: string
          program_id?: string | null
          res_address?: string | null
          res_block?: string | null
          res_district?: string | null
          res_pin?: string | null
          res_state?: string | null
          res_village?: string | null
          source?: string | null
          status?: string
          territory_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      letter_lifecycle: {
        Row: {
          actor_id: string
          created_at: string
          event: string
          from_status: string | null
          id: string
          letter_id: string
          metadata: Json
          reason: string | null
          to_status: string
        }
        Insert: {
          actor_id: string
          created_at?: string
          event: string
          from_status?: string | null
          id?: string
          letter_id: string
          metadata?: Json
          reason?: string | null
          to_status: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          event?: string
          from_status?: string | null
          id?: string
          letter_id?: string
          metadata?: Json
          reason?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "letter_lifecycle_letter_id_fkey"
            columns: ["letter_id"]
            isOneToOne: false
            referencedRelation: "appointment_letters"
            referencedColumns: ["id"]
          },
        ]
      }
      letter_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          category: string
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          priority: string
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          priority?: string
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          priority?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      partner_territories: {
        Row: {
          allocated_at: string
          allocated_by: string
          id: string
          lead_id: string | null
          partner_id: string
          released_at: string | null
          status: string
          territory_id: string
        }
        Insert: {
          allocated_at?: string
          allocated_by: string
          id?: string
          lead_id?: string | null
          partner_id: string
          released_at?: string | null
          status?: string
          territory_id: string
        }
        Update: {
          allocated_at?: string
          allocated_by?: string
          id?: string
          lead_id?: string | null
          partner_id?: string
          released_at?: string | null
          status?: string
          territory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_territories_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_territories_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_territories_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          activated_on: string | null
          created_at: string
          id: string
          lead_id: string | null
          name: string
          parent_id: string | null
          partner_code: string
          partner_type: string
          status: string
          territory_id: string | null
        }
        Insert: {
          activated_on?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          name: string
          parent_id?: string | null
          partner_code?: string
          partner_type?: string
          status?: string
          territory_id?: string | null
        }
        Update: {
          activated_on?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          name?: string
          parent_id?: string | null
          partner_code?: string
          partner_type?: string
          status?: string
          territory_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assigned_district: string | null
          assigned_state: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          mfa_enabled: boolean
          phone: string | null
        }
        Insert: {
          assigned_district?: string | null
          assigned_state?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          is_active?: boolean
          last_login_at?: string | null
          mfa_enabled?: boolean
          phone?: string | null
        }
        Update: {
          assigned_district?: string | null
          assigned_state?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          mfa_enabled?: boolean
          phone?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          bank_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          bank_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          bank_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          lead_id: string | null
          reserved_by: string | null
          status: string
          territory_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          lead_id?: string | null
          reserved_by?: string | null
          status?: string
          territory_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          lead_id?: string | null
          reserved_by?: string | null
          status?: string
          territory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_views: {
        Row: {
          created_at: string
          filters: Json
          id: string
          module: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          module?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          module?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      territories: {
        Row: {
          block: string
          capacity: number
          created_at: string
          district: string
          id: string
          lat: number | null
          lng: number | null
          occupied: number
          reserved: number
          state: string
          status: string
        }
        Insert: {
          block: string
          capacity?: number
          created_at?: string
          district: string
          id?: string
          lat?: number | null
          lng?: number | null
          occupied?: number
          reserved?: number
          state: string
          status?: string
        }
        Update: {
          block?: string
          capacity?: number
          created_at?: string
          district?: string
          id?: string
          lat?: number | null
          lng?: number | null
          occupied?: number
          reserved?: number
          state?: string
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          checklist: Json
          created_at: string
          decision: string | null
          id: string
          lead_id: string
          remarks: string | null
          verified_by: string | null
        }
        Insert: {
          checklist?: Json
          created_at?: string
          decision?: string | null
          id?: string
          lead_id: string
          remarks?: string | null
          verified_by?: string | null
        }
        Update: {
          checklist?: Json
          created_at?: string
          decision?: string | null
          id?: string
          lead_id?: string
          remarks?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bulk_reserve_territories: {
        Args: { _lead_id: string; _territory_ids: string[] }
        Returns: number
      }
      decide_application: {
        Args: {
          _conditions: string
          _decision: string
          _lead_id: string
          _reason: string
          _signature: string
          _territory_ids?: string[]
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      issue_appointment_letter: {
        Args: {
          _effective_date: string
          _expiry_date: string
          _lead_id: string
          _pdf_hash: string
          _pdf_path: string
          _previous_letter_id?: string
          _qr_token: string
          _signatory: string
          _snapshot: Json
          _template_id: string
        }
        Returns: string
      }
      record_document_review: {
        Args: {
          _checklist?: Json
          _comment: string
          _decision: string
          _document_id: string
          _duplicate_matches?: Json
          _reason_code: string
        }
        Returns: string
      }
      release_reservation: {
        Args: { _reason: string; _reservation_id: string }
        Returns: undefined
      }
      revoke_appointment_letter: {
        Args: { _letter_id: string; _reason: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "state_manager"
        | "district_manager"
        | "lead_executive"
        | "verification_officer"
        | "approver"
        | "letter_issuer"
        | "auditor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "state_manager",
        "district_manager",
        "lead_executive",
        "verification_officer",
        "approver",
        "letter_issuer",
        "auditor",
      ],
    },
  },
} as const
