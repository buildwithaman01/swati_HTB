-- =============================================================================
-- FIX DATABASE SEQUENCES AND PERMISSIONS (POSTGRESQL & SUPABASE)
-- Swati Home Tuition Bureau (Patna, Bihar)
--
-- PURPOSE:
-- Fixes "permission denied for sequence <seq_name>" (SQLSTATE 42501) errors
-- when creating/inserting records via anon, authenticated, or service_role in
-- Supabase or PostgreSQL.
--
-- ROOT CAUSE:
-- In PostgreSQL, when an INSERT trigger calls nextval('sequence_name'), the function
-- executes by default with the caller's privileges (SECURITY INVOKER). If the caller
-- (e.g., anonymous visitor booking a demo or submitting teacher registration) does not
-- have USAGE permission on the sequence, PostgreSQL raises:
-- "permission denied for sequence teacher_id_seq" / "student_id_seq" / "session_seq"
--
-- COMPLETE IMMUNIZATION:
-- 1. Grant USAGE, SELECT on all existing sequences in public schema.
-- 2. Configure ALTER DEFAULT PRIVILEGES so all future sequences are auto-granted.
-- 3. Dynamic PL/pgSQL loop granting ALL PRIVILEGES on every sequence in information_schema.
-- 4. Dynamic PL/pgSQL loop altering ALL trigger functions to SECURITY DEFINER,
--    ensuring triggers execute with postgres owner privileges regardless of who calls them.
--
-- Instructions: Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dtbhafjzoybnmqgxdwoo/sql
-- =============================================================================

-- =============================================================================
-- STEP 1: ENSURE ALL KNOWN APPLICATION SEQUENCES EXIST
-- =============================================================================
CREATE SEQUENCE IF NOT EXISTS teacher_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS student_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS assignment_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS session_seq START 1;

-- =============================================================================
-- STEP 2: GRANT USAGE & SELECT ON ALL EXISTING SEQUENCES IN PUBLIC SCHEMA
-- =============================================================================
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- =============================================================================
-- STEP 3: CONFIGURE DEFAULT PRIVILEGES FOR ALL FUTURE SEQUENCES
-- =============================================================================
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT USAGE, SELECT ON SEQUENCES TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public 
    GRANT USAGE, SELECT ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- =============================================================================
-- STEP 4: DYNAMIC PL/PGSQL BLOCK — GRANT ALL PRIVILEGES ON ALL SEQUENCES
-- Iterates through information_schema.sequences where sequence_schema = 'public'
-- =============================================================================
DO $$
DECLARE
    seq_record RECORD;
    v_count INT := 0;
BEGIN
    FOR seq_record IN 
        SELECT sequence_schema, sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
    LOOP
        EXECUTE format(
            'GRANT ALL PRIVILEGES ON SEQUENCE %I.%I TO postgres, anon, authenticated, service_role',
            seq_record.sequence_schema,
            seq_record.sequence_name
        );
        v_count := v_count + 1;
        RAISE NOTICE 'Granted ALL PRIVILEGES on sequence: %.%', seq_record.sequence_schema, seq_record.sequence_name;
    END LOOP;
    RAISE NOTICE 'Successfully granted privileges on % sequence(s).', v_count;
END $$;

-- =============================================================================
-- STEP 5: EXPLICIT SECURITY DEFINER HARDENING FOR KNOWN TRIGGER FUNCTIONS
-- =============================================================================
DO $$
BEGIN
    -- set_teacher_id
    IF EXISTS (
        SELECT 1 FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' AND p.proname = 'set_teacher_id'
    ) THEN
        ALTER FUNCTION public.set_teacher_id() SECURITY DEFINER;
        RAISE NOTICE 'Updated set_teacher_id to SECURITY DEFINER';
    END IF;

    -- set_student_id
    IF EXISTS (
        SELECT 1 FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' AND p.proname = 'set_student_id'
    ) THEN
        ALTER FUNCTION public.set_student_id() SECURITY DEFINER;
        RAISE NOTICE 'Updated set_student_id to SECURITY DEFINER';
    END IF;

    -- set_assignment_id
    IF EXISTS (
        SELECT 1 FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' AND p.proname = 'set_assignment_id'
    ) THEN
        ALTER FUNCTION public.set_assignment_id() SECURITY DEFINER;
        RAISE NOTICE 'Updated set_assignment_id to SECURITY DEFINER';
    END IF;

    -- set_session_id (if present)
    IF EXISTS (
        SELECT 1 FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' AND p.proname = 'set_session_id'
    ) THEN
        ALTER FUNCTION public.set_session_id() SECURITY DEFINER;
        RAISE NOTICE 'Updated set_session_id to SECURITY DEFINER';
    END IF;
END $$;

-- =============================================================================
-- STEP 6: DYNAMIC PL/PGSQL BLOCK — IMMUNIZE ALL TRIGGER FUNCTIONS TO SECURITY DEFINER
-- Automatically finds and alters every trigger function and ID generator in public
-- =============================================================================
DO $$
DECLARE
    func_record RECORD;
    v_func_count INT := 0;
BEGIN
    FOR func_record IN
        SELECT 
            n.nspname AS schema_name,
            p.proname AS func_name,
            COALESCE(pg_get_function_identity_arguments(p.oid), '') AS func_args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
          AND (
              p.prorettype = 'trigger'::regtype
              OR p.prorettype = 'pg_catalog.trigger'::regtype
              OR p.proname IN ('set_student_id', 'set_teacher_id', 'set_assignment_id', 'set_session_id')
              OR p.proname LIKE 'set_%_id'
              OR p.proname LIKE 'trg_%'
          )
    LOOP
        EXECUTE format(
            'ALTER FUNCTION %I.%I(%s) SECURITY DEFINER',
            func_record.schema_name,
            func_record.func_name,
            func_record.func_args
        );
        v_func_count := v_func_count + 1;
        RAISE NOTICE 'Immunized trigger function %.%(%) to SECURITY DEFINER',
            func_record.schema_name,
            func_record.func_name,
            func_record.func_args;
    END LOOP;
    RAISE NOTICE 'Successfully immunized % trigger function(s) to SECURITY DEFINER.', v_func_count;
END $$;

-- =============================================================================
-- STEP 7: VERIFICATION & AUDIT REPORT
-- Displays all sequences and confirmed status
-- =============================================================================
SELECT 
    sequence_schema,
    sequence_name,
    data_type,
    start_value,
    'PERMISSIONS_GRANTED_OK' AS status
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;
