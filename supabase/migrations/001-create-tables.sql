-- ========================================
-- Aqua Vault Database Schema for Supabase
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Users Table (uses Supabase Auth)
-- ========================================

-- User profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    avatar TEXT,
    daily_water_goal INTEGER DEFAULT 2000,
    daily_caffeine_limit INTEGER DEFAULT 400,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Drink Records Table
-- ========================================
CREATE TABLE IF NOT EXISTS drink_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    volume INTEGER NOT NULL,
    calories INTEGER DEFAULT 0,
    caffeine INTEGER DEFAULT 0,
    sugar REAL DEFAULT 0,
    category TEXT NOT NULL,
    icon TEXT,
    accent_color TEXT,
    note TEXT,
    drink_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for drink_records
CREATE INDEX IF NOT EXISTS idx_drink_records_user_id ON drink_records(user_id);
CREATE INDEX IF NOT EXISTS idx_drink_records_drink_time ON drink_records(drink_time);

-- ========================================
-- Cups Table
-- ========================================
CREATE TABLE IF NOT EXISTS cups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    icon TEXT,
    accent_color TEXT,
    background_color TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    use_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for cups
CREATE INDEX IF NOT EXISTS idx_cups_user_id ON cups(user_id);
CREATE INDEX IF NOT EXISTS idx_cups_is_favorite ON cups(is_favorite);

-- ========================================
-- Row Level Security (RLS) Policies
-- ========================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cups ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Drink Records Policies
CREATE POLICY "Users can view their own drink records"
    ON drink_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drink records"
    ON drink_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drink records"
    ON drink_records FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drink records"
    ON drink_records FOR DELETE
    USING (auth.uid() = user_id);

-- Cups Policies
CREATE POLICY "Users can view their own cups"
    ON cups FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cups"
    ON cups FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cups"
    ON cups FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cups"
    ON cups FOR DELETE
    USING (auth.uid() = user_id);

-- ========================================
-- Trigger to update updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drink_records_updated_at BEFORE UPDATE ON drink_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cups_updated_at BEFORE UPDATE ON cups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Auto-create user profile on signup
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
