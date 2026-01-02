CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    subdomain VARCHAR UNIQUE NOT NULL,
    status VARCHAR DEFAULT 'active',
    subscription_plan VARCHAR DEFAULT 'free',
    max_users INTEGER DEFAULT 5,
    max_projects INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
