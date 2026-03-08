-- Add per-category inflation support
ALTER TABLE "households" ADD COLUMN "inflation_mode" TEXT NOT NULL DEFAULT 'simple';
ALTER TABLE "expense_categories" ADD COLUMN "inflation_preset" TEXT NOT NULL DEFAULT '20yr';
ALTER TABLE "expense_categories" ADD COLUMN "custom_inflation_rate" DECIMAL(5,2) NOT NULL DEFAULT 0;
