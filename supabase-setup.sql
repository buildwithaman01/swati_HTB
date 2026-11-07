-- =============================================================================
-- SWATI HOME TUITION BUREAU (JOB-02) — MASTER PRODUCTION SCHEMA & MIGRATION
-- Location: Patna, Bihar | Project: Swati Home Tuition Bureau
-- Instructions: Run this full script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dtbhafjzoybnmqgxdwoo/sql
-- =============================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 2. SEQUENCES & AUTO-ID GENERATORS
-- =============================================================================
CREATE SEQUENCE IF NOT EXISTS teacher_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS assignment_id_seq START 1;

-- =============================================================================
-- 3. CREATE & MIGRATE TEACHERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id TEXT UNIQUE,
    auth_user_id UUID,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    whatsapp TEXT,
    email TEXT,
    gender TEXT DEFAULT 'other',
    date_of_birth DATE,
    qualification TEXT,
    institution TEXT,
    experience_years INT DEFAULT 0,
    locality TEXT,
    address TEXT,
    subjects TEXT[] DEFAULT '{}',
    classes_taught TEXT[] DEFAULT '{}',
    areas_serviceable TEXT[] DEFAULT '{}',
    aadhar_number TEXT,
    pan_number TEXT,
    id_proof_url TEXT,
    profile_photo_url TEXT,
    police_verified BOOLEAN DEFAULT false,
    police_cert_url TEXT,
    badge_level TEXT DEFAULT 'verified',
    verification_status TEXT DEFAULT 'pending',
    profile_visibility TEXT DEFAULT 'public',
    is_active BOOLEAN DEFAULT false,
    internal_notes TEXT,
    rejection_reason TEXT,
    rating_average NUMERIC(3,2) DEFAULT 5.0,
    total_reviews INT DEFAULT 0,
    approved_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure all columns exist if table was previously created
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS teacher_id TEXT UNIQUE;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS auth_user_id UUID;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS institution TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS areas_serviceable TEXT[] DEFAULT '{}';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS aadhar_number TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS pan_number TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS id_proof_url TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS police_verified BOOLEAN DEFAULT false;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS police_cert_url TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS badge_level TEXT DEFAULT 'verified';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS rating_average NUMERIC(3,2) DEFAULT 5.0;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS total_reviews INT DEFAULT 0;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS approved_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Teacher Auto-ID Trigger (TCH-2026-001)
CREATE OR REPLACE FUNCTION set_teacher_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.teacher_id IS NULL OR NEW.teacher_id = '' THEN
        NEW.teacher_id := 'TCH-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('teacher_id_seq')::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_teacher_id ON public.teachers;
CREATE TRIGGER trg_set_teacher_id
BEFORE INSERT ON public.teachers
FOR EACH ROW
EXECUTE FUNCTION set_teacher_id();

-- =============================================================================
-- 4. CREATE & MIGRATE STUDENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT UNIQUE,
    parent_auth_user_id UUID,
    full_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_whatsapp TEXT,
    whatsapp TEXT,
    parent_email TEXT,
    email TEXT,
    locality TEXT,
    address TEXT,
    class_studying TEXT,
    board TEXT DEFAULT 'CBSE',
    subjects_required TEXT[] DEFAULT '{}',
    subjects_needed TEXT[] DEFAULT '{}',
    tuition_type_preference TEXT DEFAULT 'home',
    gender_preference TEXT DEFAULT 'no_preference',
    budget_range TEXT,
    enrollment_status TEXT DEFAULT 'enquiry', -- enquiry, demo, enrolled, paused, dropped
    special_needs TEXT,
    preferred_timing TEXT,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure all columns exist if table was previously created
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_auth_user_id UUID;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_whatsapp TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_email TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS locality TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS class_studying TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS board TEXT DEFAULT 'CBSE';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS subjects_required TEXT[] DEFAULT '{}';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS subjects_needed TEXT[] DEFAULT '{}';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS tuition_type_preference TEXT DEFAULT 'home';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS gender_preference TEXT DEFAULT 'no_preference';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS budget_range TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS enrollment_status TEXT DEFAULT 'enquiry';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS special_needs TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS preferred_timing TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Student Auto-ID Trigger (STD-2026-001) + Dual Column Synchronization
CREATE OR REPLACE FUNCTION set_student_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.student_id IS NULL OR NEW.student_id = '' THEN
        NEW.student_id := 'STD-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('student_id_seq')::TEXT, 3, '0');
    END IF;
    -- Keep subjects_required and subjects_needed synchronized so neither fails
    IF (NEW.subjects_required IS NOT NULL AND array_length(NEW.subjects_required, 1) > 0) 
       AND (NEW.subjects_needed IS NULL OR array_length(NEW.subjects_needed, 1) IS NULL) THEN
        NEW.subjects_needed := NEW.subjects_required;
    ELSIF (NEW.subjects_needed IS NOT NULL AND array_length(NEW.subjects_needed, 1) > 0) 
       AND (NEW.subjects_required IS NULL OR array_length(NEW.subjects_required, 1) IS NULL) THEN
        NEW.subjects_required := NEW.subjects_needed;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_student_id ON public.students;
CREATE TRIGGER trg_set_student_id
BEFORE INSERT ON public.students
FOR EACH ROW
EXECUTE FUNCTION set_student_id();

-- =============================================================================
-- 5. CREATE & MIGRATE ASSIGNMENTS TABLE (Tutor-Student Matching)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id TEXT UNIQUE,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    classes_per_week INT DEFAULT 3,
    session_duration_mins INT DEFAULT 60,
    session_days TEXT[] DEFAULT '{}',
    session_time TEXT,
    monthly_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    bureau_commission_pct NUMERIC(5,2) DEFAULT 25.00,
    bureau_commission_amt NUMERIC(10,2) GENERATED ALWAYS AS (ROUND(monthly_fee * bureau_commission_pct / 100, 2)) STORED,
    teacher_earning NUMERIC(10,2) GENERATED ALWAYS AS (ROUND(monthly_fee * (100 - bureau_commission_pct) / 100, 2)) STORED,
    start_date DATE,
    notes TEXT,
    status TEXT DEFAULT 'active', -- active, paused, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS assignment_id TEXT UNIQUE;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS classes_per_week INT DEFAULT 3;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS session_duration_mins INT DEFAULT 60;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS session_days TEXT[] DEFAULT '{}';
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS session_time TEXT;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS bureau_commission_pct NUMERIC(5,2) DEFAULT 25.00;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE OR REPLACE FUNCTION set_assignment_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.assignment_id IS NULL OR NEW.assignment_id = '' THEN
        NEW.assignment_id := 'ASN-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('assignment_id_seq')::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_assignment_id ON public.assignments;
CREATE TRIGGER trg_set_assignment_id
BEFORE INSERT ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION set_assignment_id();

-- =============================================================================
-- 6. CREATE & MIGRATE SESSIONS TABLE (Daily Attendance & Syllabus Logs)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIME,
    duration_mins INT DEFAULT 60,
    topics_covered TEXT NOT NULL,
    homework_assigned TEXT,
    student_attendance TEXT DEFAULT 'present', -- present, absent, cancelled
    status TEXT DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compatibility columns for session timing and notes
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS session_start TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS session_end TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS homework_assigned TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS homework_given TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS teacher_notes TEXT;

-- =============================================================================
-- 7. CREATE & MIGRATE PROGRESS REPORTS TABLE (Monthly Parent Reports)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.progress_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    report_month DATE NOT NULL,
    topics_covered TEXT,
    test_scores TEXT,
    strengths TEXT,
    areas_of_improvement TEXT,
    overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5),
    teacher_remarks TEXT,
    sent_to_parent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 8. CREATE & MIGRATE PAYMENTS TABLE (Parent Fee Receipts)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_month TEXT NOT NULL, -- e.g. '2026-08'
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_mode TEXT DEFAULT 'upi', -- upi, cash, bank_transfer
    upi_ref TEXT,
    status TEXT DEFAULT 'received', -- received, pending, refunded
    received_by TEXT DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist if table was previously created
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL;

-- =============================================================================
-- 9. CREATE & MIGRATE COMMISSIONS TABLE (Teacher Payouts)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- e.g. '2026-08'
    gross_amount NUMERIC(10,2) NOT NULL,
    commission_pct NUMERIC(5,2) NOT NULL DEFAULT 25.00,
    commission_amount NUMERIC(10,2) NOT NULL,
    teacher_payout NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, paid
    payout_date DATE,
    payout_mode TEXT DEFAULT 'upi',
    payout_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist if table was previously created
ALTER TABLE public.commissions ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.students(id) ON DELETE CASCADE;
ALTER TABLE public.commissions ADD COLUMN IF NOT EXISTS assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE;

-- =============================================================================
-- 10. CREATE & MIGRATE REVIEWS TABLE (Teacher Ratings & Feedback)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    token TEXT UNIQUE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    parent_name TEXT,
    locality TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compatibility columns for assignments and reviews
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS review_token TEXT UNIQUE;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS token_used BOOLEAN DEFAULT false;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS end_reason TEXT;

-- =============================================================================
-- 11. FINANCE RPC FUNCTION: monthly_revenue_summary()
-- =============================================================================
CREATE OR REPLACE FUNCTION public.monthly_revenue_summary()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_revenue', COALESCE(SUM(amount), 0),
        'total_transactions', COUNT(*)
    ) INTO result
    FROM public.payments
    WHERE status = 'received';
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Restrict execution permissions on SECURITY DEFINER function
REVOKE ALL ON FUNCTION public.monthly_revenue_summary() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.monthly_revenue_summary() TO service_role, authenticated;

-- =============================================================================
-- 12. STORAGE BUCKET: KYC DOCUMENTS (PRIVATE & STRICTLY ENCRYPTED)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Drop all public / open policies on KYC storage
DROP POLICY IF EXISTS "Public View KYC Documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow Upload KYC Documents" ON storage.objects;
DROP POLICY IF EXISTS "Service role full access on KYC Documents" ON storage.objects;

-- Only service_role has access to private KYC bucket
CREATE POLICY "Service role full access on KYC Documents" 
ON storage.objects FOR ALL 
TO service_role 
USING (bucket_id = 'kyc-documents')
WITH CHECK (bucket_id = 'kyc-documents');

-- =============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Service Role Full Access on all tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
        AND tablename IN ('teachers', 'students', 'assignments', 'sessions', 'progress_reports', 'payments', 'commissions', 'reviews')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Service role full access on %I" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Service role full access on %I" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)', t, t);
    END LOOP;
END $$;

-- Drop insecure open anon insert policies
DROP POLICY IF EXISTS "Allow anon insert teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow anon insert students" ON public.students;

-- Authenticated Teachers: can only view and edit their own record
DROP POLICY IF EXISTS "Teachers view own profile" ON public.teachers;
CREATE POLICY "Teachers view own profile" ON public.teachers
FOR SELECT TO authenticated
USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Teachers update own profile" ON public.teachers;
CREATE POLICY "Teachers update own profile" ON public.teachers
FOR UPDATE TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- Authenticated Parents: can only view their own student records
DROP POLICY IF EXISTS "Parents view own student" ON public.students;
CREATE POLICY "Parents view own student" ON public.students
FOR SELECT TO authenticated
USING (parent_auth_user_id = auth.uid() OR email = auth.jwt() ->> 'email' OR parent_email = auth.jwt() ->> 'email');

-- Public Anon Read: ONLY for public verified reviews
DROP POLICY IF EXISTS "Public view approved reviews" ON public.reviews;
CREATE POLICY "Public view approved reviews" ON public.reviews
FOR SELECT TO anon
USING (is_public = true AND is_verified = true);

-- Public Anon Read on Teachers: Allow SELECT only for approved public profiles
DROP POLICY IF EXISTS "Public view approved teachers" ON public.teachers;
CREATE POLICY "Public view approved teachers" ON public.teachers
FOR SELECT TO anon
USING (verification_status = 'approved' AND is_active = true AND profile_visibility = 'public');

-- Column-level security: Prevent anon users from querying sensitive columns like Aadhaar, PAN, phone, address, and internal notes
REVOKE ALL ON public.teachers FROM anon;
GRANT SELECT (
    id, teacher_id, full_name, gender, qualification, institution, 
    experience_years, locality, subjects, classes_taught, 
    areas_serviceable, profile_photo_url, badge_level, 
    verification_status, rating_average, total_reviews, created_at
) ON public.teachers TO anon;

-- =============================================================================
-- 14. INITIAL SEED DATA
-- =============================================================================
INSERT INTO public.teachers (
    teacher_id, full_name, phone, whatsapp, email, gender, 
    qualification, institution, experience_years, locality, 
    subjects, classes_taught, verification_status, badge_level, is_active, internal_notes
) VALUES 
(
    'TCH-2026-001', 
    'Aman Kumar Singh', 
    '9390906318', 
    '9390906318', 
    'aman.kalpra.11@gmail.com', 
    'male', 
    'BTech/BE', 
    'Patna College', 
    3, 
    'Patna', 
    ARRAY['Maths', 'Physics'], 
    ARRAY['Class 9-10', 'Class 11-12'], 
    'approved',
    'elite',
    true,
    'System Architect & Lead Verified Tutor'
),
(
    'TCH-2026-002', 
    'Ragini Singh', 
    '9876252353', 
    '9876252353', 
    'ragini.singh@example.com', 
    'female', 
    'BA/BSc/BCom', 
    'IGNOU', 
    2, 
    'Mithapur', 
    ARRAY['Physics', 'Chemistry'], 
    ARRAY['Class 1-8', 'Class 9-10'], 
    'approved',
    'verified',
    true,
    'Female-first tutor for Science in Mithapur'
)
ON CONFLICT (phone) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    locality = EXCLUDED.locality,
    verification_status = EXCLUDED.verification_status;

INSERT INTO public.students (
    student_id, full_name, parent_name, parent_phone, whatsapp,
    locality, address, class_studying, board, subjects_required, subjects_needed,
    enrollment_status, internal_notes
) VALUES 
(
    'STD-2026-001',
    'Aarav Sharma',
    'Rajesh Sharma',
    '9876543210',
    '9876543210',
    'Boring Road',
    'Flat 302, Maurya Vihar, Boring Road, Patna',
    '10',
    'CBSE',
    ARRAY['Maths', 'Science'],
    ARRAY['Maths', 'Science'],
    'demo',
    'Demo requested for Class 10 CBSE Maths. Preparing for Board exam.'
),
(
    'STD-2026-002',
    'Pooja Verma',
    'Sunita Verma',
    '9811223344',
    '9811223344',
    'Patliputra Colony',
    'Road No. 4, Patliputra Colony, Patna',
    '12',
    'CBSE',
    ARRAY['Physics', 'Chemistry'],
    ARRAY['Physics', 'Chemistry'],
    'enrolled',
    'Requires female teacher preference. Active enrolled.'
)
ON CONFLICT (student_id) DO NOTHING;

-- =============================================================================
-- 15. DYNAMIC SEQUENCE SYNCHRONIZATION (Prevent Auto-ID Collisions)
-- =============================================================================
SELECT setval(
    'teacher_id_seq', 
    GREATEST(COALESCE((SELECT MAX(SUBSTRING(teacher_id FROM '[0-9]+$')::BIGINT) FROM public.teachers WHERE teacher_id ~ 'TCH-[0-9]{4}-[0-9]+$'), 0) + 1, 1), 
    false
);

SELECT setval(
    'student_id_seq', 
    GREATEST(COALESCE((SELECT MAX(SUBSTRING(student_id FROM '[0-9]+$')::BIGINT) FROM public.students WHERE student_id ~ 'STD-[0-9]{4}-[0-9]+$'), 0) + 1, 1), 
    false
);

SELECT setval(
    'assignment_id_seq', 
    GREATEST(COALESCE((SELECT MAX(SUBSTRING(assignment_id FROM '[0-9]+$')::BIGINT) FROM public.assignments WHERE assignment_id ~ 'ASN-[0-9]{4}-[0-9]+$'), 0) + 1, 1), 
    false
);

-- =============================================================================
-- 16. FOREIGN KEY CASCADE HARDENING (Fix Constraint Violations on Delete/Update)
-- =============================================================================

-- Assignments constraints (Cascade when teacher or student is deleted)
ALTER TABLE public.assignments DROP CONSTRAINT IF EXISTS assignments_teacher_id_fkey;
ALTER TABLE public.assignments ADD CONSTRAINT assignments_teacher_id_fkey 
    FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;

ALTER TABLE public.assignments DROP CONSTRAINT IF EXISTS assignments_student_id_fkey;
ALTER TABLE public.assignments ADD CONSTRAINT assignments_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

-- Sessions constraints (Cascade when assignment, teacher or student is deleted)
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_assignment_id_fkey;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_assignment_id_fkey 
    FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;

ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_teacher_id_fkey;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_teacher_id_fkey 
    FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;

ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_student_id_fkey;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

-- Progress reports constraints
ALTER TABLE public.progress_reports DROP CONSTRAINT IF EXISTS progress_reports_assignment_id_fkey;
ALTER TABLE public.progress_reports ADD CONSTRAINT progress_reports_assignment_id_fkey 
    FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;

ALTER TABLE public.progress_reports DROP CONSTRAINT IF EXISTS progress_reports_teacher_id_fkey;
ALTER TABLE public.progress_reports ADD CONSTRAINT progress_reports_teacher_id_fkey 
    FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;

ALTER TABLE public.progress_reports DROP CONSTRAINT IF EXISTS progress_reports_student_id_fkey;
ALTER TABLE public.progress_reports ADD CONSTRAINT progress_reports_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

-- Reviews constraints
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_assignment_id_fkey;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_assignment_id_fkey 
    FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE SET NULL;

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_teacher_id_fkey;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_teacher_id_fkey 
    FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_student_id_fkey;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE SET NULL;

-- Commissions constraints
ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_assignment_id_fkey;
ALTER TABLE public.commissions ADD CONSTRAINT commissions_assignment_id_fkey 
    FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;

ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_teacher_id_fkey;
ALTER TABLE public.commissions ADD CONSTRAINT commissions_teacher_id_fkey 
    FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;

ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_student_id_fkey;
ALTER TABLE public.commissions ADD CONSTRAINT commissions_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

-- Payments constraints (Cascade on student delete, Set Null on assignment/teacher delete to preserve audit history)
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_student_id_fkey;
ALTER TABLE public.payments ADD CONSTRAINT payments_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_assignment_id_fkey;
ALTER TABLE public.payments ADD CONSTRAINT payments_assignment_id_fkey 
    FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE SET NULL;

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_teacher_id_fkey;
ALTER TABLE public.payments ADD CONSTRAINT payments_teacher_id_fkey 
    FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE SET NULL;

-- =============================================================================
-- 17. CANONICAL DATABASE SCHEMA SPECIFICATION & RUNTIME ALIGNMENT NOTES
-- =============================================================================
-- NOTE: The live PostgreSQL / Supabase database has the following canonical definitions:
-- 1. sessions:
--    - homework_given (TEXT)
--    - session_start (TIME)
--    - session_end (TIME)
--    - teacher_notes (TEXT)
-- 2. progress_reports:
--    - sent_to_parent (BOOLEAN DEFAULT false)
--    - sent_at (TIMESTAMP WITH TIME ZONE)
--    - strengths (TEXT)
--    - areas_of_improvement (TEXT)
--    - overall_rating (INT CHECK (overall_rating BETWEEN 1 AND 5))
-- 3. assignments:
--    - monthly_fee (NUMERIC(10,2) NOT NULL DEFAULT 0)
--    - bureau_commission_pct (NUMERIC(5,2) DEFAULT 25.00)
--    - bureau_commission_amt (NUMERIC(10,2) GENERATED ALWAYS AS (ROUND(monthly_fee * bureau_commission_pct / 100, 2)) STORED)
--    - teacher_earning (NUMERIC(10,2) GENERATED ALWAYS AS (ROUND(monthly_fee * (100 - bureau_commission_pct) / 100, 2)) STORED)
--
-- DO NOT add duplicate columns or overwrite generated columns. The application codebase
-- maps all input properties directly to these canonical columns.
