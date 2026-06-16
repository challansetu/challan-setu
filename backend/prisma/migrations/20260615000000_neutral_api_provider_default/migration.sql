-- Drop the third-party provider name as the default; the app now uses its own scraper.
ALTER TABLE "challan_searches" ALTER COLUMN "apiProvider" SET DEFAULT 'scraper';
