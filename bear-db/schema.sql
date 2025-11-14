
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password_hash TEXT, role TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS plans (id TEXT PRIMARY KEY, name TEXT, price REAL, duration_days INTEGER, features_json TEXT);
INSERT OR IGNORE INTO plans (id,name,price,duration_days,features_json) VALUES ('start','Start',59.9,30,'[]');
INSERT OR IGNORE INTO plans (id,name,price,duration_days,features_json) VALUES ('gamer','Gamer',79.9,30,'[]');
INSERT OR IGNORE INTO plans (id,name,price,duration_days,features_json) VALUES ('progamer','Pro Gamer',149.9,365,'[]');
CREATE TABLE IF NOT EXISTS purchases (id INTEGER PRIMARY KEY, user_id INTEGER, plan_id TEXT, amount REAL, installments INTEGER, created_at TEXT, expires_at TEXT, payment_ref TEXT);
CREATE TABLE IF NOT EXISTS affiliates (id INTEGER PRIMARY KEY, email TEXT UNIQUE, codigo TEXT UNIQUE, commission_rate REAL DEFAULT 0.2, payout_freq TEXT, bank_info TEXT, cpf TEXT, sales_count INTEGER DEFAULT 0, total_commission REAL DEFAULT 0, active INTEGER DEFAULT 1, invited_by TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY, purchase_id INTEGER, affiliate_id INTEGER, amount REAL, commission_amount REAL, created_at TEXT, paid INTEGER DEFAULT 0);
