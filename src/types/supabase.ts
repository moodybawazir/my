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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      content_pages: {
        Row: {
          content: Json
          id: string
          section_key: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          id?: string
          section_key: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          id?: string
          section_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      demos: {
        Row: {
          data: Json
          demo_key: string
          id: string
          industry_id: string
          updated_at: string | null
        }
        Insert: {
          data: Json
          demo_key: string
          id?: string
          industry_id: string
          updated_at?: string | null
        }
        Update: {
          data?: Json
          demo_key?: string
          id?: string
          industry_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      industry_sections: {
        Row: {
          action_link: string | null
          action_text: string | null
          created_at: string | null
          demo_type: string | null
          description: string | null
          id: string
          image_url: string | null
          industry_id: string
          section_type: string | null
          sort_order: number | null
          subtitle: string | null
          title: string
        }
        Insert: {
          action_link?: string | null
          action_text?: string | null
          created_at?: string | null
          demo_type?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          industry_id: string
          section_type?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title: string
        }
        Update: {
          action_link?: string | null
          action_text?: string | null
          created_at?: string | null
          demo_type?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          industry_id?: string
          section_type?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      industry_sub_services: {
        Row: {
          created_at: string | null
          description: string | null
          features: string[] | null
          icon: string | null
          id: string
          image_url: string | null
          industry_id: string
          is_active: boolean | null
          price: string | null
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          industry_id: string
          is_active?: boolean | null
          price?: string | null
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          industry_id?: string
          is_active?: boolean | null
          price?: string | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          date: string | null
          due_date: string | null
          id: string
          status: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          amount: number
          date?: string | null
          due_date?: string | null
          id: string
          status?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          amount?: number
          date?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_programs: {
        Row: {
          bg_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          industry_id: string
          reward_icon: string | null
          reward_text: string | null
          stamp_icon: string | null
          title: string
          total_stamps: number | null
        }
        Insert: {
          bg_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry_id: string
          reward_icon?: string | null
          reward_text?: string | null
          stamp_icon?: string | null
          title: string
          total_stamps?: number | null
        }
        Update: {
          bg_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry_id?: string
          reward_icon?: string | null
          reward_text?: string | null
          stamp_icon?: string | null
          title?: string
          total_stamps?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          category: string | null
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          sender_name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          sender_name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          sender_name?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          service_id: string | null
          title: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          service_id?: string | null
          title?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          service_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          checkout_url: string | null
          created_at: string | null
          id: string
          ls_customer_id: string | null
          ls_order_id: string | null
          payment_status: string | null
          status: string | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          checkout_url?: string | null
          created_at?: string | null
          id?: string
          ls_customer_id?: string | null
          ls_order_id?: string | null
          payment_status?: string | null
          status?: string | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          checkout_url?: string | null
          created_at?: string | null
          id?: string
          ls_customer_id?: string | null
          ls_order_id?: string | null
          payment_status?: string | null
          status?: string | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          file_url: string | null
          full_description: string | null
          id: string
          images: string[] | null
          ls_variant_id: string | null
          name: string
          price: number | null
          rating: number | null
          reviews_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          file_url?: string | null
          full_description?: string | null
          id?: string
          images?: string[] | null
          ls_variant_id?: string | null
          name: string
          price?: number | null
          rating?: number | null
          reviews_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          file_url?: string | null
          full_description?: string | null
          id?: string
          images?: string[] | null
          ls_variant_id?: string | null
          name?: string
          price?: number | null
          rating?: number | null
          reviews_count?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          features: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      real_estate_sections: {
        Row: {
          additional_data: Json | null
          button_link: string | null
          button_text: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          order_index: number | null
          section_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          additional_data?: Json | null
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          section_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          additional_data?: Json | null
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          section_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      real_estate_sub_services: {
        Row: {
          created_at: string | null
          description: string
          features: Json | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          order_index: number | null
          price: string
          service_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          features?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          price: string
          service_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          features?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          price?: string
          service_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_packages: {
        Row: {
          extras: Json | null
          id: string
          is_featured: boolean | null
          limits: Json | null
          package_description: string | null
          package_name: string
          plan_id: string | null
          service_id: string | null
          sort_order: number | null
        }
        Insert: {
          extras?: Json | null
          id?: string
          is_featured?: boolean | null
          limits?: Json | null
          package_description?: string | null
          package_name: string
          plan_id?: string | null
          service_id?: string | null
          sort_order?: number | null
        }
        Update: {
          extras?: Json | null
          id?: string
          is_featured?: boolean | null
          limits?: Json | null
          package_description?: string | null
          package_name?: string
          plan_id?: string | null
          service_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_packages_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_packages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          desc: string | null
          description: string | null
          has_subscription: boolean | null
          icon: string | null
          id: string
          image_url: string | null
          ls_variant_id: string | null
          price: number | null
          project_id: string | null
          sort_order: number | null
          subscription_type: string | null
          title: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          desc?: string | null
          description?: string | null
          has_subscription?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          ls_variant_id?: string | null
          price?: number | null
          project_id?: string | null
          sort_order?: number | null
          subscription_type?: string | null
          title: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          desc?: string | null
          description?: string | null
          has_subscription?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          ls_variant_id?: string | null
          price?: number | null
          project_id?: string | null
          sort_order?: number | null
          subscription_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      store_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          image: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "store_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "store_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      store_products: {
        Row: {
          attributes: Json | null
          category_id: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          full_description: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          sale_price: number | null
          sku: string | null
          slug: string
          stock: number | null
        }
        Insert: {
          attributes?: Json | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          full_description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          sale_price?: number | null
          sku?: string | null
          slug: string
          stock?: number | null
        }
        Update: {
          attributes?: Json | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          full_description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          sale_price?: number | null
          sku?: string | null
          slug?: string
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "store_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "store_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_bimonthly: number | null
          price_monthly: number
          price_yearly: number
          service_id: string | null
          tier_level: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_bimonthly?: number | null
          price_monthly: number
          price_yearly: number
          service_id?: string | null
          tier_level?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_bimonthly?: number | null
          price_monthly?: number
          price_yearly?: number
          service_id?: string | null
          tier_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plans_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          plan_name: string
          price: number | null
          service_id: string | null
          start_date: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          plan_name: string
          price?: number | null
          service_id?: string | null
          start_date: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          plan_name?: string
          price?: number | null
          service_id?: string | null
          start_date?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          billing_cycle: string | null
          created_at: string | null
          end_date: string
          id: string
          package_id: string | null
          payment_ref: string | null
          plan_id: string | null
          service_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          billing_cycle?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          package_id?: string | null
          payment_ref?: string | null
          plan_id?: string | null
          service_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          billing_cycle?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          package_id?: string | null
          payment_ref?: string | null
          plan_id?: string | null
          service_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          balance: number | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          name: string | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
          used_free_service: boolean | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          used_free_service?: boolean | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          used_free_service?: boolean | null
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
    Enums: {},
  },
} as const
