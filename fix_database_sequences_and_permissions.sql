-- =============================================================================
-- NARROW LEAST-PRIVILEGE FIX FOR SESSION INSERT (VERIFIED BY DBA)
-- Swati Home Tuition Bureau (Patna, Bihar)
--
-- PURPOSE:
-- Resolves SQLSTATE 42501 (permission denied for sequence session_seq) on sessions insert.
-- The column public.sessions.session_id uses public.session_seq for its default value.
--
-- APPLIED IN SUPABASE SQL EDITOR:
-- =============================================================================

-- 1. Grant USAGE on session_seq to authenticated tutors and the service_role API
GRANT USAGE ON SEQUENCE public.session_seq TO authenticated, service_role;

-- 2. Verification query (Confirms authenticated and service_role have USAGE)
SELECT 
    c.relname AS sequence_name,
    has_sequence_privilege('authenticated', c.oid, 'USAGE') AS authenticated_usage,
    has_sequence_privilege('service_role', c.oid, 'USAGE') AS service_role_usage
FROM pg_catalog.pg_class c
WHERE c.relkind = 'S'
  AND c.relname = 'session_seq'
  AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
