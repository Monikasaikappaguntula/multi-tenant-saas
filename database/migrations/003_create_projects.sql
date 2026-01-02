CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    name VARCHAR NOT NULL,
    description TEXT,
    status VARCHAR DEFAULT 'active',
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔗 Tenant FK
ALTER TABLE projects
ADD CONSTRAINT projects_tenant_id_fkey
FOREIGN KEY (tenant_id)
REFERENCES tenants(id)
ON DELETE CASCADE;

-- 🔗 Creator FK
ALTER TABLE projects
ADD CONSTRAINT projects_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES users(id)
ON DELETE SET NULL;

-- ⚡ Index
CREATE INDEX IF NOT EXISTS idx_projects_tenant_id
ON projects (tenant_id);
