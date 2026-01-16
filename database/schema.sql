-- Social Stack: Production Database Matrix
-- Version: 3.4.0 (PostgreSQL Optimized)

-- 1. Identity & Authority (Users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'root', 'admin', 'user', 'reseller'
    balance DECIMAL(15, 4) DEFAULT 0.0000,
    currency VARCHAR(3) DEFAULT 'USD',
    language VARCHAR(10) DEFAULT 'en-US',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'flagged', 'suspended'
    avatar_url TEXT,
    two_factor_secret TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. System Orchestration (Global Settings)
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Global Nexus Data
INSERT INTO system_settings (key, value, description) VALUES 
('maintenance_mode', 'false', 'Lock global application access'),
('site_announcement', '"Welcome to Social Stack v3.4. System nodes nominal."', 'Global ticker message'),
('global_markup', '25', 'Percentage markup on external API costs'),
('allowed_ips', '[]', 'Whitelist for administrative access');

-- 3. Provisioning Logic (Orders)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    external_provider VARCHAR(100), -- 'PeakSMM', 'DigitalOcean', etc.
    external_order_id VARCHAR(255),
    service_name TEXT NOT NULL,
    target_node TEXT NOT NULL, -- Link or IP Address
    quantity INTEGER,
    cost DECIMAL(15, 4) NOT NULL,
    price DECIMAL(15, 4) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'refunded'
    raw_response JSONB, -- Logs API callback data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Financial Matrix (Transactions)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'deposit', 'purchase', 'refund', 'manual_adjustment'
    amount DECIMAL(15, 4) NOT NULL,
    payment_method VARCHAR(50), -- 'stripe', 'bkash', 'binance', 'wallet'
    reference_id VARCHAR(255), -- External Tx ID
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Asset Hub (Media & Storage)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50), -- 'image', 'video', 'data'
    file_size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Live Telemetry (Audit Logs)
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    node VARCHAR(100), -- 'CORE_KERNEL', 'AI_ENGINE', etc.
    severity VARCHAR(20) DEFAULT 'info', -- 'info', 'success', 'warning', 'critical'
    event_type VARCHAR(100),
    description TEXT,
    ip_address VARCHAR(45),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Induction (Indices)
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_log_severity ON system_logs(severity);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_system_logs_node ON system_logs(node);

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_settings_modtime BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();