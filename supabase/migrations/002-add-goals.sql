-- ========================================
-- Add daily calorie and sugar goals to user_profiles
-- ========================================

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS daily_calorie_goal INTEGER DEFAULT 2000,
ADD COLUMN IF NOT EXISTS daily_sugar_limit INTEGER DEFAULT 50;

-- Update the handle_new_user function to include default values
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, daily_water_goal, daily_caffeine_limit, daily_calorie_goal, daily_sugar_limit)
    VALUES (new.id, new.email, 2000, 400, 2000, 50);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
