export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          agency: string
          brand: string
          created_at: string
          equipment_id: string
          id: string
          last_maintenance: string | null
          location: string
          model: string
          next_maintenance: string | null
          serial_number: string
          status: string
          technician: string | null
          temperature: string | null
          type: string
          updated_at: string
        }
        Insert: {
          agency: string
          brand: string
          created_at?: string
          equipment_id: string
          id?: string
          last_maintenance?: string | null
          location: string
          model: string
          next_maintenance?: string | null
          serial_number: string
          status: string
          technician?: string | null
          temperature?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          agency?: string
          brand?: string
          created_at?: string
          equipment_id?: string
          id?: string
          last_maintenance?: string | null
          location?: string
          model?: string
          next_maintenance?: string | null
          serial_number?: string
          status?: string
          technician?: string | null
          temperature?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      failure_predictions: {
        Row: {
          created_at: string
          equipment_id: string
          equipment_name: string
          failure_risk: number
          id: string
          location: string
          predicted_date: string
          recommended_action: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          equipment_id: string
          equipment_name: string
          failure_risk: number
          id?: string
          location: string
          predicted_date: string
          recommended_action: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          equipment_id?: string
          equipment_name?: string
          failure_risk?: number
          id?: string
          location?: string
          predicted_date?: string
          recommended_action?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_reports: {
        Row: {
          cost: number
          created_at: string
          date: string
          description: string
          duration: string
          equipment: string
          id: string
          location: string
          parts_used: string[] | null
          region: string
          report_id: string
          status: string
          technician: string
          type: string
          updated_at: string
        }
        Insert: {
          cost?: number
          created_at?: string
          date: string
          description: string
          duration: string
          equipment: string
          id?: string
          location: string
          parts_used?: string[] | null
          region: string
          report_id: string
          status: string
          technician: string
          type: string
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          date?: string
          description?: string
          duration?: string
          equipment?: string
          id?: string
          location?: string
          parts_used?: string[] | null
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
      profiles: {
        Row: {
          agency: string | null
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          agency?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          agency?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      technician_recommendations: {
        Row: {
          availability: string
          created_at: string
          equipment_id: string
          equipment_name: string
          experience: string
          expertise: string[] | null
          id: string
          location: string
          match_score: number
          success_rate: number
          technician: string
          updated_at: string
        }
        Insert: {
          availability: string
          created_at?: string
          equipment_id: string
          equipment_name: string
          experience: string
          expertise?: string[] | null
          id?: string
          location: string
          match_score: number
          success_rate: number
          technician: string
          updated_at?: string
        }
        Update: {
          availability?: string
          created_at?: string
          equipment_id?: string
          equipment_name?: string
          experience?: string
          expertise?: string[] | null
          id?: string
          location?: string
          match_score?: number
          success_rate?: number
          technician?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
