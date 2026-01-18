
-- Social Stack: SQLite Production Node Schema
-- Version: 3.5.0 (Optimized for Local & Edge Storage)
-- Compatible with: PHP 5.6, 7.4, 8.1, 8.3, 8.4

-- 1. Identity & Permissions
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- UUID String
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'user', -- 'admin', 'user'
    balance REAL DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    language TEXT DEFAULT 'en-US',
    status TEXT DEFAULT 'active',
    avatar_url TEXT,
    two_factor_enabled INTEGER DEFAULT 0, -- Boolean 0/1
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. System Configuration Matrix
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL, -- JSON String
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Global Nexus Data
INSERT OR IGNORE INTO system_settings (key, value, description) VALUES 
('maintenance_mode', 'false', 'Lock global application access'),
('site_announcement', '"Welcome to Social Stack v3.5. Node frequencies stable."', 'Global ticker message'),
('api_sync_interval', '3600', 'Automatic provider sync interval in seconds'),
('php_version_lock', '"8.3"', 'Enforced PHP runtime environment');

-- 3. Provisioning & Orders
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    external_provider TEXT,
    external_order_id TEXT,
    service_name TEXT NOT NULL,
    target_node TEXT NOT NULL,
    quantity INTEGER,
    cost REAL NOT NULL,
    price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    raw_response TEXT, -- JSON Log
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Financial Ledger
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'deposit', 'purchase', 'refund'
    amount REAL NOT NULL,
    payment_method TEXT,
    reference_id TEXT,
    metadata TEXT, -- JSON Log
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Creative Asset Vault
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Telemetry & Security Logs
CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    node TEXT, -- 'AUTH_NODE', 'API_DAEMON', etc.
    severity TEXT DEFAULT 'info',
    event_type TEXT,
    description TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance Optimization (Triggers & Indices)
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_order_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_log_severity ON system_logs(severity);

CREATE TRIGGER IF NOT EXISTS update_user_timestamp 
AFTER UPDATE ON users
BEGIN
   UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
