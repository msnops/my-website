/*
  # DevOps Training Platform Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text) - Course title
      - `description` (text) - Course description
      - `category` (text) - DevOps or Data Engineering
      - `duration` (text) - Course duration
      - `level` (text) - Beginner, Intermediate, Advanced
      - `price` (numeric) - Course price
      - `features` (jsonb) - Array of course features
      - `created_at` (timestamptz)
    
    - `enrollments`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `name` (text) - Student name
      - `email` (text) - Student email
      - `phone` (text) - Student phone
      - `message` (text) - Additional message
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Courses are publicly readable
    - Enrollments can be inserted by anyone (public form)
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('devops', 'data-engineering')),
  duration text NOT NULL,
  level text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  price numeric NOT NULL DEFAULT 0,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are publicly readable"
  ON courses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can enroll in courses"
  ON enrollments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);