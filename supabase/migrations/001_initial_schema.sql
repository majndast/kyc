-- Know Your Code (KYC) Database Schema
-- Run this in Supabase SQL Editor

-- Profiles (extension of auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  locale TEXT DEFAULT 'cs',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_cs TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_cs TEXT,
  description_en TEXT,
  icon TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_cs TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_cs TEXT NOT NULL,
  content_en TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

-- Quiz Questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_cs TEXT NOT NULL,
  question_en TEXT NOT NULL,
  code_snippet TEXT,
  options JSONB NOT NULL,
  explanation_cs TEXT,
  explanation_en TEXT,
  order_index INT DEFAULT 0
);

-- User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  quiz_score INT,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Row Level Security Policies

-- Profiles: Users can read all profiles, update only their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses: Everyone can read
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone" ON courses
  FOR SELECT USING (true);

-- Lessons: Everyone can read
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone" ON lessons
  FOR SELECT USING (true);

-- Quiz Questions: Everyone can read
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are viewable by everyone" ON quiz_questions
  FOR SELECT USING (true);

-- User Progress: Users can only read/write their own progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, locale)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'locale', 'cs'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_quiz_questions_lesson_id ON quiz_questions(lesson_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
