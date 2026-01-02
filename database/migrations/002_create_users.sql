CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID,
    email VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    full_name VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'users_tenant_id_fkey'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_tenant_id_fkey
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS users_tenant_email_unique
ON users (tenant_id, email);
