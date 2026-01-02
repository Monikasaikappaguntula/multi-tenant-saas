CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID,
    action VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'audit_logs_tenant_id_fkey'
    ) THEN
        ALTER TABLE audit_logs
        ADD CONSTRAINT audit_logs_tenant_id_fkey
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE SET NULL;
    END IF;
END $$;
