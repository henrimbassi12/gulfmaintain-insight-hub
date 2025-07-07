export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      conversation_participants: {
        Row: {
          avatar_url: string | null
          conversation_id: string
          created_at: string
          id: string
          is_online: boolean | null
          user_name: string
          user_role: string
        }
        Insert: {
          avatar_url?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          is_online?: boolean | null
          user_name: string
          user_role: string
        }
        Update: {
          avatar_url?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_online?: boolean | null
          user_name?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipments: {
        Row: {
          af_nf: string
          branding: string
          created_at: string
          date: string
          division: string
          id: string
          localisation: string
          nom_client: string
          nom_pdv: string
          partenaire: string
          quartier: string
          secteur: string
          serial_number: string
          tag_number: string
          technician: string
          tel_barman: string
          type_frigo: string
          updated_at: string
          ville: string
        }
        Insert: {
          af_nf: string
          branding: string
          created_at?: string
          date: string
          division: string
          id?: string
          localisation: string
          nom_client: string
          nom_pdv: string
          partenaire: string
          quartier: string
          secteur: string
          serial_number: string
          tag_number: string
          technician: string
          tel_barman: string
          type_frigo: string
          updated_at?: string
          ville: string
        }
        Update: {
          af_nf?: string
          branding?: string
          created_at?: string
          date?: string
          division?: string
          id?: string
          localisation?: string
          nom_client?: string
          nom_pdv?: string
          partenaire?: string
          quartier?: string
          secteur?: string
          serial_number?: string
          tag_number?: string
          technician?: string
          tel_barman?: string
          type_frigo?: string
          updated_at?: string
          ville?: string
        }
        Relationships: []
      }
      failure_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string
          environmental_factors: Json | null
          equipment_brand: string | null
          equipment_id: string
          equipment_model: string | null
          equipment_name: string
          equipment_serial_number: string | null
          failure_risk: number
          id: string
          location: string
          maintenance_history: Json | null
          predicted_date: string
          recommended_action: string
          type: string
          updated_at: string
          usage_pattern: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          environmental_factors?: Json | null
          equipment_brand?: string | null
          equipment_id: string
          equipment_model?: string | null
          equipment_name: string
          equipment_serial_number?: string | null
          failure_risk: number
          id?: string
          location: string
          maintenance_history?: Json | null
          predicted_date: string
          recommended_action: string
          type: string
          updated_at?: string
          usage_pattern?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          environmental_factors?: Json | null
          equipment_brand?: string | null
          equipment_id?: string
          equipment_model?: string | null
          equipment_name?: string
          equipment_serial_number?: string | null
          failure_risk?: number
          id?: string
          location?: string
          maintenance_history?: Json | null
          predicted_date?: string
          recommended_action?: string
          type?: string
          updated_at?: string
          usage_pattern?: string | null
        }
        Relationships: []
      }
      maintenance_reports: {
        Row: {
          assigned_technician: string | null
          completion_percentage: number | null
          cost: number
          created_at: string
          date: string
          description: string
          duration: string
          equipment: string
          equipment_brand: string | null
          equipment_model: string | null
          equipment_serial_number: string | null
          id: string
          images: string[] | null
          location: string
          next_maintenance_date: string | null
          notes: string | null
          parts_used: string[] | null
          priority: string | null
          region: string
          report_id: string
          status: string
          technician: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_technician?: string | null
          completion_percentage?: number | null
          cost?: number
          created_at?: string
          date: string
          description: string
          duration: string
          equipment: string
          equipment_brand?: string | null
          equipment_model?: string | null
          equipment_serial_number?: string | null
          id?: string
          images?: string[] | null
          location: string
          next_maintenance_date?: string | null
          notes?: string | null
          parts_used?: string[] | null
          priority?: string | null
          region: string
          report_id: string
          status: string
          technician: string
          type: string
          updated_at?: string
        }
        Update: {
          assigned_technician?: string | null
          completion_percentage?: number | null
          cost?: number
          created_at?: string
          date?: string
          description?: string
          duration?: string
          equipment?: string
          equipment_brand?: string | null
          equipment_model?: string | null
          equipment_serial_number?: string | null
          id?: string
          images?: string[] | null
          location?: string
          next_maintenance_date?: string | null
          notes?: string | null
          parts_used?: string[] | null
          priority?: string | null
          region?: string
          report_id?: string
          status?: string
          technician?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_me: boolean | null
          sender_name: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_me?: boolean | null
          sender_name: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_me?: boolean | null
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      planned_maintenances: {
        Row: {
          af_nf: string
          branding: string
          created_at: string
          date_creation: string
          date_programmee: string
          description: string | null
          division: string
          duree_estimee: string
          id: string
          localisation: string
          nom_client: string
          nom_pdv: string
          partenaire: string
          priorite: string
          quartier: string
          secteur: string
          serial_number: string
          tag_number: string
          technician_assigne: string
          tel_barman: string
          type_frigo: string
          type_maintenance: string
          updated_at: string
          ville: string
        }
        Insert: {
          af_nf: string
          branding: string
          created_at?: string
          date_creation: string
          date_programmee: string
          description?: string | null
          division: string
          duree_estimee: string
          id?: string
          localisation: string
          nom_client: string
          nom_pdv: string
          partenaire: string
          priorite: string
          quartier: string
          secteur: string
          serial_number: string
          tag_number: string
          technician_assigne: string
          tel_barman: string
          type_frigo: string
          type_maintenance: string
          updated_at?: string
          ville: string
        }
        Update: {
          af_nf?: string
          branding?: string
          created_at?: string
          date_creation?: string
          date_programmee?: string
          description?: string | null
          division?: string
          duree_estimee?: string
          id?: string
          localisation?: string
          nom_client?: string
          nom_pdv?: string
          partenaire?: string
          priorite?: string
          quartier?: string
          secteur?: string
          serial_number?: string
          tag_number?: string
          technician_assigne?: string
          tel_barman?: string
          type_frigo?: string
          type_maintenance?: string
          updated_at?: string
          ville?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          agency: string | null
          approved_at: string | null
          approved_by: string | null
          availability_status: string | null
          avatar_url: string | null
          certification_level: string | null
          created_at: string
          current_location: string | null
          email: string
          experience_years: number | null
          full_name: string | null
          id: string
          last_login: string | null
          notification_preferences: Json | null
          phone: string | null
          role: string
          specialization: string[] | null
          updated_at: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          agency?: string | null
          approved_at?: string | null
          approved_by?: string | null
          availability_status?: string | null
          avatar_url?: string | null
          certification_level?: string | null
          created_at?: string
          current_location?: string | null
          email: string
          experience_years?: number | null
          full_name?: string | null
          id: string
          last_login?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          role?: string
          specialization?: string[] | null
          updated_at?: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          agency?: string | null
          approved_at?: string | null
          approved_by?: string | null
          availability_status?: string | null
          avatar_url?: string | null
          certification_level?: string | null
          created_at?: string
          current_location?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          role?: string
          specialization?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "pending_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_recommendations: {
        Row: {
          availability: string
          certification_level: string | null
          created_at: string
          current_workload: number | null
          email: string | null
          equipment_id: string
          equipment_name: string
          experience: string
          expertise: string[] | null
          id: string
          last_assignment_date: string | null
          location: string
          match_score: number
          phone: string | null
          rating: number | null
          specialization: string[] | null
          success_rate: number
          technician: string
          updated_at: string
        }
        Insert: {
          availability: string
          certification_level?: string | null
          created_at?: string
          current_workload?: number | null
          email?: string | null
          equipment_id: string
          equipment_name: string
          experience: string
          expertise?: string[] | null
          id?: string
          last_assignment_date?: string | null
          location: string
          match_score: number
          phone?: string | null
          rating?: number | null
          specialization?: string[] | null
          success_rate: number
          technician: string
          updated_at?: string
        }
        Update: {
          availability?: string
          certification_level?: string | null
          created_at?: string
          current_workload?: number | null
          email?: string | null
          equipment_id?: string
          equipment_name?: string
          experience?: string
          expertise?: string[] | null
          id?: string
          last_assignment_date?: string | null
          location?: string
          match_score?: number
          phone?: string | null
          rating?: number | null
          specialization?: string[] | null
          success_rate?: number
          technician?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      pending_users: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          agency: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          role: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          agency?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          role?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          agency?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_user: {
        Args: { user_id: string; approver_id: string }
        Returns: undefined
      }
      get_current_user_full_name: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_approved: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      reject_user: {
        Args: { user_id: string; approver_id: string }
        Returns: undefined
      }
    }
    Enums: {
      account_status: "pending" | "approved" | "rejected"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      account_status: ["pending", "approved", "rejected"],
    },
  },
} as const
