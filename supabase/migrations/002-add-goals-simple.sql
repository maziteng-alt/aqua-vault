-- ========================================
-- Add daily calorie and sugar goals to user_profiles
-- ========================================

-- 只添加新字段（这是安全的，即使字段已存在也不会报错）
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS daily_calorie_goal INTEGER DEFAULT 2000,
ADD COLUMN IF NOT EXISTS daily_sugar_limit INTEGER DEFAULT 50;

-- 更新 handle_new_user 函数以包含默认值
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, daily_water_goal, daily_caffeine_limit, daily_calorie_goal, daily_sugar_limit)
    VALUES (new.id, new.email, 2000, 400, 2000, 50);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 为现有用户设置默认值（如果他们还没有这些字段）
UPDATE user_profiles 
SET daily_calorie_goal = COALESCE(daily_calorie_goal, 2000),
    daily_sugar_limit = COALESCE(daily_sugar_limit, 50);
