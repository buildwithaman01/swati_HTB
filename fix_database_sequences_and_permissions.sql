-- =============================================================================
-- LEAST-PRIVILEGE SEQUENCE PERMISSIONS & FUNCTION HARDENING SCRIPT
-- Swati Home Tuition Bureau (Patna, Bihar)
--
-- REVIEWED & REFINED:
-- 1. Minimal Least-Privilege Grants: Grants ONLY 'USAGE, SELECT' (never ALL PRIVILEGES).
-- 2. Role Segmentation: Only roles that execute inserts receive grants.
-- 3. Hardened SECURITY DEFINER: Sets explicit 'search_path = public, pg_temp' on targeted
--    functions to prevent search_path escalation vulnerabilities.
-- 4. Sequence Realignment: Safely resynchronizes sequence current values with MAX()
--    identifiers to prevent collision errors.
-- 5. Covers All Live Schema Dependencies:
--    - sessions.session_id -> session_seq
--    - reviews.review_id -> review_seq
--    - teachers.teacher_id -> teacher_id_seq
--    - students.student_id -> student_id_seq
--    - assignments.assignment_id -> assignment_id_seq
--    - generate_payment_id() & generate_commission_id()
-- =============================================================================

-- =============================================================================
-- 1. ENSURE SEQUENCES EXIST (IDEMPOTENT)
-- =============================================================================
CREATE SEQUENCE IF NOT EXISTS public.teacher_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.assignment_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.session_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.review_seq START 1;

-- =============================================================================
-- 2. LEAST-PRIVILEGE SEQUENCE GRANTS
-- USAGE allows NEXTVAL/CURRVAL. SELECT allows CURRVAL/viewing sequence metadata.
-- =============================================================================

-- Tutors & internal API write sessions -> authenticated, service_role
GRANT USAGE, SELECT ON SEQUENCE public.session_seq TO authenticated, service_role;

-- Assignments are created by admins or managed workflows -> authenticated, service_role
GRANT USAGE, SELECT ON SEQUENCE public.assignment_id_seq TO authenticated, service_role;

-- Reviews can be submitted by authenticated parents or via tokenized review links
GRANT USAGE, SELECT ON SEQUENCE public.review_seq TO anon, authenticated, service_role;

-- Public intake forms allow prospective tutors & parents to register without prior login
GRANT USAGE, SELECT ON SEQUENCE public.teacher_id_seq TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.student_id_seq TO anon, authenticated, service_role;

-- =============================================================================
-- 3. SEQUENCE VALUE SYNCHRONIZATION WITH EXISTING TABLE RECORDS
-- Prevents unique constraint collisions if sequence counters lagged behind inserted rows
-- =============================================================================
DO $$
BEGIN
    -- Synchronize teacher_id_seq
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'teachers') THEN
        PERFORM setval(
            'public.teacher_id_seq',
            GREATEST(COALESCE((SELECT MAX(SUBSTRING(teacher_id FROM '[0-9]+$')::BIGINT) FROM public.teachers WHERE teacher_id ~ '[0-9]+$'), 0) + 1, 1),
            false
        );
    END IF;

    -- Synchronize student_id_seq
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'students') THEN
        PERFORM setval(
            'public.student_id_seq',
            GREATEST(COALESCE((SELECT MAX(SUBSTRING(student_id FROM '[0-9]+$')::BIGINT) FROM public.students WHERE student_id ~ '[0-9]+$'), 0) + 1, 1),
            false
        );
    END IF;

    -- Synchronize assignment_id_seq
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'assignments') THEN
        PERFORM setval(
            'public.assignment_id_seq',
            GREATEST(COALESCE((SELECT MAX(SUBSTRING(assignment_id FROM '[0-9]+$')::BIGINT) FROM public.assignments WHERE assignment_id ~ '[0-9]+$'), 0) + 1, 1),
            false
        );
    END IF;

    -- Synchronize session_seq
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sessions') THEN
        PERFORM setval(
            'public.session_seq',
            GREATEST(COALESCE((SELECT MAX(SUBSTRING(session_id FROM '[0-9]+$')::BIGINT) FROM public.sessions WHERE session_id ~ '[0-9]+$'), 0) + 1, 1),
            false
        );
    END IF;

    -- Synchronize review_seq (if review_id exists)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'review_id'
    ) THEN
        PERFORM setval(
            'public.review_seq',
            GREATEST(COALESCE((SELECT MAX(SUBSTRING(review_id FROM '[0-9]+$')::BIGINT) FROM public.reviews WHERE review_id ~ '[0-9]+$'), 0) + 1, 1),
            false
        );
    END IF;
END $$;

-- =============================================================================
-- 4. SURGICAL SECURITY DEFINER HARDENING WITH PINNED SEARCH_PATH
-- Only applies to verified ID-generating functions. Pins search_path to public, pg_temp
-- to mitigate CVE search_path escalation vulnerabilities.
-- =============================================================================
DO $$
DECLARE
    f RECORD;
BEGIN
    FOR f IN
        SELECT 
            n.nspname AS schema_name,
            p.proname AS func_name,
            COALESCE(pg_get_function_identity_arguments(p.oid), '') AS func_args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
          AND p.proname IN (
              'set_teacher_id',
              'set_student_id',
              'set_assignment_id',
              'set_session_id',
              'set_review_id',
              'generate_payment_id',
              'generate_commission_id'
          )
    LOOP
        EXECUTE format(
            'ALTER FUNCTION %I.%I(%s) SECURITY DEFINER SET search_path = public, pg_temp;',
            f.schema_name,
            f.func_name,
            f.func_args
        );
        RAISE NOTICE 'Hardened function %.%(%) with SECURITY DEFINER and search_path = public, pg_temp',
            f.schema_name, f.func_name, f.func_args;
    END LOOP;
END $$;

-- =============================================================================
-- 5. VERIFICATION AUDIT QUERY
-- Inspects sequence privileges and current values
-- =============================================================================
SELECT 
    c.relname AS sequence_name,
    pg_catalog.pg_get_userbyid(c.relowner) AS owner,
    has_sequence_privilege('authenticated', c.oid, 'USAGE') AS authenticated_usage,
    has_sequence_privilege('service_role', c.oid, 'USAGE') AS service_role_usage,
    has_sequence_privilege('anon', c.oid, 'USAGE') AS anon_usage
FROM pg_catalog.pg_class c
WHERE c.relkind = 'S'
  AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY c.relname;
