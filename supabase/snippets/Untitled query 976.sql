CREATE TABLE website_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_name text NOT NULL,
  business_type text NOT NULL,
  business_description text NOT NULL,
  location text NOT NULL,
  target_audience text NOT NULL,
  website_goal text NOT NULL,
  pages text[] NOT NULL,
  features text[] NOT NULL,
  design_style text NOT NULL,
  color_preferences text NOT NULL,
  brand_assets text NOT NULL,
  seo_keywords text NOT NULL,
  seo_location text NOT NULL,
  competitors text NOT NULL,
  platform_preference text NOT NULL,
  generated_prompt text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE website_projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own projects
CREATE POLICY "Users can view their own projects" ON website_projects
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own projects
CREATE POLICY "Users can insert their own projects" ON website_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own projects
CREATE POLICY "Users can delete their own projects" ON website_projects
  FOR DELETE USING (auth.uid() = user_id);