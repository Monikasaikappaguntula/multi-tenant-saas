CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID,
    tenant_id UUID,
    title VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'tasks_project_id_fkey'
    ) THEN
        ALTER TABLE tasks
        ADD CONSTRAINT tasks_project_id_fkey
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'tasks_tenant_id_fkey'
    ) THEN
        ALTER TABLE tasks
        ADD CONSTRAINT tasks_tenant_id_fkey
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tasks_tenant_project
ON tasks (tenant_id, project_id);
