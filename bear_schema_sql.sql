-- ========================================
-- BEAR OPTIMIZER PRO - DATABASE SCHEMA
-- SQLite Database Structure
-- ========================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ========================================
-- USERS
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  cpf TEXT UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('admin', 'affiliate', 'client')),
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CLIENTS
-- ========================================
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  plan TEXT NOT NULL CHECK(plan IN ('start', 'gamer', 'pro')),
  plan_start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  plan_end_date DATETIME,
  license_key TEXT UNIQUE,
  affiliate_code TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- PLANS
-- ========================================
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  duration_days INTEGER NOT NULL,
  features_json TEXT
);

-- ========================================
-- PURCHASES
-- ========================================
CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  plan_id TEXT,
  amount REAL NOT NULL,
  installments INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  payment_ref TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(plan_id) REFERENCES plans(id)
);

-- ========================================
-- TRANSACTIONS (PIX)
-- ========================================
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  amount REAL NOT NULL,
  affiliate_code TEXT,
  pix_code TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'cancelled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,
  FOREIGN KEY(plan_id) REFERENCES plans(id)
);

-- ========================================
-- AFFILIATES
-- ========================================
CREATE TABLE IF NOT EXISTS affiliates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  email TEXT UNIQUE NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  commission_rate REAL DEFAULT 0.20,
  payout_freq TEXT CHECK(payout_freq IN ('weekly','biweekly')) DEFAULT 'weekly',
  bank_info TEXT,
  cpf TEXT,
  sales_count INTEGER DEFAULT 0,
  total_commission REAL DEFAULT 0,
  pending_commission REAL DEFAULT 0,
  paid_commission REAL DEFAULT 0,
  active INTEGER DEFAULT 1,
  invited_by TEXT,
  last_payment_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ========================================
-- SALES
-- ========================================
CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id INTEGER,
  client_id INTEGER,
  affiliate_id INTEGER,
  plan TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'paid',
  commission_amount REAL,
  commission_paid INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,
  payout_date DATETIME,
  FOREIGN KEY(purchase_id) REFERENCES purchases(id),
  FOREIGN KEY(client_id) REFERENCES clients(id),
  FOREIGN KEY(affiliate_id) REFERENCES affiliates(id)
);

-- ========================================
-- PAYOUTS (Comissões)
-- ========================================
CREATE TABLE IF NOT EXISTS payouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  affiliate_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  scheduled_at DATETIME NOT NULL,
  paid_at DATETIME,
  freq TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'failed')),
  payment_proof TEXT,
  notes TEXT,
  FOREIGN KEY(affiliate_id) REFERENCES affiliates(id)
);

-- ========================================
-- SCRIPTS
-- ========================================
CREATE TABLE IF NOT EXISTS scripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK(type IN ('bat', 'ps1', 'reg')),
  category TEXT NOT NULL,
  plan_required TEXT NOT NULL CHECK(plan_required IN ('start', 'gamer', 'pro')),
  code TEXT NOT NULL,
  icon TEXT,
  execution_count INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(created_by) REFERENCES users(id)
);

-- ========================================
-- ACTIVITY LOGS
-- ========================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ========================================
-- ÍNDICES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);
CREATE INDEX IF NOT EXISTS idx_clients_plan ON clients(plan);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(codigo);
CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates(email);
CREATE INDEX IF NOT EXISTS idx_sales_affiliate ON sales(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(email);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_scripts_plan ON scripts(plan_required);

-- ========================================
-- SEED INICIAL
-- ========================================

-- Planos
INSERT OR IGNORE INTO plans (id, name, price, duration_days, features_json) VALUES
('start', 'Start', 59.90, 30, '{"scripts":15,"diagnostico":true,"dpiConfig":false,"gpuPanel":false}'),
('gamer', 'Gamer', 79.90, 30, '{"scripts":25,"diagnostico":true,"dpiConfig":true,"gpuPanel":true}'),
('pro', 'Pro Gamer', 99.90, 30, '{"scripts":35,"diagnostico":true,"dpiConfig":true,"gpuPanel":true}');

-- Admin padrão
-- Senha: bear@3131 (hash SHA256)
INSERT OR IGNORE INTO users (email, password_hash, name, type, status) VALUES
('bearservice13@gmail.com', 'ef92b3c32e8f9ee6b6b2b6f8d8e4f0c0e1b1f5c4d6a7e8f9c0b1a2d3e4f5a6b7', 'Administrador', 'admin', 'active');
