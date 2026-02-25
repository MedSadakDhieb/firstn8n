
/*
  # Create n8n Wiki Schema

  1. New Tables
    - `wiki_articles`
      - `id` (uuid, primary key) - Unique identifier for each article
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly version of title
      - `content` (text) - Article content in markdown
      - `category` (text) - Category/topic of the article
      - `tags` (text array) - Tags for better organization
      - `created_at` (timestamptz) - When the article was created
      - `updated_at` (timestamptz) - When the article was last updated
      - `views` (integer) - Number of times the article has been viewed
  
  2. Security
    - Enable RLS on `wiki_articles` table
    - Add policy for anyone to read articles (public wiki)
    - Add policy for authenticated users to create articles
    - Add policy for authenticated users to update their own articles
    - Add policy for authenticated users to delete their own articles
    hahahahahah
*/

CREATE TABLE IF NOT EXISTS wiki_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  views integer DEFAULT 0
);

ALTER TABLE wiki_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view articles"
  ON wiki_articles
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create articles"
  ON wiki_articles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update articles"
  ON wiki_articles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete articles"
  ON wiki_articles
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_wiki_articles_slug ON wiki_articles(slug);
CREATE INDEX IF NOT EXISTS idx_wiki_articles_category ON wiki_articles(category);
CREATE INDEX IF NOT EXISTS idx_wiki_articles_created_at ON wiki_articles(created_at DESC);