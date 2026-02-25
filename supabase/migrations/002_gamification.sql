-- Gamification: XP System, Daily Goals, and Streaks
-- Migration 002

-- Rozšíření profiles pro gamifikaci
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 20;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_freezes INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hearts INTEGER DEFAULT 5;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS max_hearts INTEGER DEFAULT 5;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_heart_regen TIMESTAMPTZ DEFAULT NOW();

-- Denní XP tracking
CREATE TABLE IF NOT EXISTS daily_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  goal_met BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Rozšíření user_progress o XP
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS xp_earned INTEGER DEFAULT 0;

-- XP transakce pro audit trail
CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'quiz_perfect', 'quiz_good', 'quiz_complete', 'lesson_complete', 'streak_bonus'
  source_id UUID, -- lesson_id nebo NULL pro streak bonus
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexy pro rychlé dotazy
CREATE INDEX IF NOT EXISTS idx_daily_xp_user_date ON daily_xp(user_id, date);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created ON xp_transactions(created_at);

-- RLS politiky pro daily_xp
ALTER TABLE daily_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily XP"
  ON daily_xp FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily XP"
  ON daily_xp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily XP"
  ON daily_xp FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS politiky pro xp_transactions
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own XP transactions"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own XP transactions"
  ON xp_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
