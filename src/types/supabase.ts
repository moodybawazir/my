// Generated via Supabase MCP
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    role: 'user' | 'admin' | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: 'user' | 'admin' | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    role?: 'user' | 'admin' | null
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    category: 'ai' | 'real_estate' | 'medical' | 'restaurants' | 'ecommerce' | 'agencies' | null
                    image_url: string | null
                    features: Json | null
                    demo_url: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    category?: 'ai' | 'real_estate' | 'medical' | 'restaurants' | 'ecommerce' | 'agencies' | null
                    image_url?: string | null
                    features?: Json | null
                    demo_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    category?: 'ai' | 'real_estate' | 'medical' | 'restaurants' | 'ecommerce' | 'agencies' | null
                    image_url?: string | null
                    features?: Json | null
                    demo_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    project_id: string | null
                    title: string
                    description: string | null
                    price: number | null
                    icon: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    title: string
                    description?: string | null
                    price?: number | null
                    icon?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    title?: string
                    description?: string | null
                    price?: number | null
                    icon?: string | null
                    created_at?: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string | null
                    plan_name: string
                    service_id: string | null
                    status: 'active' | 'trial' | 'expired' | 'cancelled' | null
                    start_date: string
                    end_date: string
                    price: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    plan_name: string
                    service_id?: string | null
                    status?: 'active' | 'trial' | 'expired' | 'cancelled' | null
                    start_date: string
                    end_date: string
                    price?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    plan_name?: string
                    service_id?: string | null
                    status?: 'active' | 'trial' | 'expired' | 'cancelled' | null
                    start_date?: string
                    end_date?: string
                    price?: number | null
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    category: string | null
                    price: number | null
                    file_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    category?: string | null
                    price?: number | null
                    file_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    category?: string | null
                    price?: number | null
                    file_url?: string | null
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    total_amount: number
                    status: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    total_amount: number
                    status?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    total_amount?: number
                    status?: string | null
                    created_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string | null
                    product_id: string | null
                    price: number
                }
                Insert: {
                    id?: string
                    order_id?: string | null
                    product_id?: string | null
                    price: number
                }
                Update: {
                    id?: string
                    order_id?: string | null
                    product_id?: string | null
                    price?: number
                }
            }
            messages: {
                Row: {
                    id: string
                    sender_name: string
                    email: string
                    message: string
                    category: string | null
                    is_read: boolean | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    sender_name: string
                    email: string
                    message: string
                    category?: string | null
                    is_read?: boolean | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    sender_name?: string
                    email?: string
                    message?: string
                    category?: string | null
                    is_read?: boolean | null
                    created_at?: string
                }
            }
            content_pages: {
                Row: {
                    id: string
                    section_key: string
                    content: Json
                    updated_at: string
                }
                Insert: {
                    id?: string
                    section_key: string
                    content: Json
                    updated_at?: string
                }
                Update: {
                    id?: string
                    section_key?: string
                    content?: Json
                    updated_at?: string
                }
            }
        }
    }
}
