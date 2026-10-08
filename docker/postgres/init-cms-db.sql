-- PostgreSQL Multi-Database Initialization Script
-- Ensures both Django core database and Strapi CMS database are provisioned with proper ownership

SELECT 'CREATE DATABASE cbz_cms OWNER cbz_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'cbz_cms')\gexec

GRANT ALL PRIVILEGES ON DATABASE cbz_cms TO cbz_user;
