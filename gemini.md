# Baseerah AI SaaS Platform - Project Map

## Current State
### Outcomes
- [ ] منصة SaaS متكاملة إدارة الاشتراكات والمشاريع الرقمية.
- [ ] 3 مشاريع رئيسية: مساعد AI، منصة عقارية (Virtual Tour)، نظام مواعيد طبية.
- [ ] لوحة تحكم للعملاء (User Dashboard) ولوحة تحكم للإدارة (Admin Dashboard).
- [ ] نظام إدارة محتوى (CMS) شامل.
- [ ] ربط كامل مع Supabase (Auth, Database, Storage).
- [ ] نشر المشروع على السيرفر الحالي (Shared Hosting/PHP) أو حل بديل مناسب.

### Scope
#### In Scope
- **Frontend**: React-based UI/UX development (improving existing codebase).
- **Backend/Database**: Supabase integration (Auth, DB, RLS, Storage).
- **Features**:
    - Authentication (Sign up, Login, Reset Password, Roles).
    - Subscriptions & Payments Management.
    - Projects Showcase (AI, Real Estate with Virtual Tour, Medical).
    - CMS for Homepage, Projects, Logos, Contact.
    - User Dashboard (Subscriptions, Products, Invoices).
    - Admin Dashboard (KPIs, Users, Content, Messages).
- **Deployment**: Deployment strategy and execution.

#### Out of Scope
- إنشاء تصميم جديد بالكامل (سنستخدم التصميم الحالي ونحسنه).
- بناء Backend مخصص من الصفر (سنعتمد على Supabase).

### Decisions
| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Use Supabase | For Auth, Database, and Real-time features without managing a backend server. | 2026-02-15 | ✅ Active |
| Use Existing Design | To speed up development and focus on functionality. | 2026-02-15 | ✅ Active |
| Hosting Strategy | TBD (Need to evaluate Shared Hosting vs Vercel/Netlify). | 2026-02-15 | 🟡 Pending |

### Schemas
#### Data Models (Preliminary)
- `users`: id, email, role (admin/user), full_name, etc.
- `subscriptions`: id, user_id, plan_id, status, start_date, end_date.
- `products`: id, name, description, status, user_id (if assigned).
- `projects`: id, title, description, category (AI, Real Estate, Medical).
- `content_pages`: key (hero, about, etc.), content (JSON).
- `messages`: id, sender_name, email, message, read_status.

### Constraints
- **Technical**: Must use React, Supabase. Must support RTL & Arabic.
- **Business**: High quality "Native App" feel for mobile. Professional UI.
- **Timeline**: 5 Weeks (Phased approach).

## Discovery Questions (Answers based on User Input)
- **Tech Stack**: React (Frontend), Supabase (Backend/DB).
- **Target Env**: Web & Mobile (Responsive).
- **Performance**: Fast loading, smooth animations.
- **Security**: RLS, Input Sanitization.
- **Users**: Admin, Clients.
- **Problem**: Need a unified platform to manage digital projects and subscriptions.
