-- =======================================================
-- Portfolio Database Schema (MySQL / MariaDB & SQLite compatible)
-- =======================================================

-- 1. Table: settings (Pengaturan Tampilan Landing Page)
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT NOT NULL PRIMARY KEY,
  `site_title` VARCHAR(255) NOT NULL DEFAULT 'Alex Carter — Developer Portfolio',
  `gallery_label` VARCHAR(255) NOT NULL DEFAULT 'Developer portfolio',
  `directory_label` VARCHAR(255) NOT NULL DEFAULT 'Project index',
  `contact_text` TEXT NOT NULL,
  `close_label` VARCHAR(100) NOT NULL DEFAULT 'Close',
  `prev_label` VARCHAR(100) NOT NULL DEFAULT 'Previous project',
  `next_label` VARCHAR(100) NOT NULL DEFAULT 'Next project',
  `bg_color` VARCHAR(50) NOT NULL DEFAULT '#f7f9fc',
  `ink_color` VARCHAR(50) NOT NULL DEFAULT '#161616',
  `gray_color` VARCHAR(50) NOT NULL DEFAULT '#a8a8a2',
  `theme_preset` VARCHAR(50) NOT NULL DEFAULT 'light',
  `author_name` VARCHAR(255) NOT NULL DEFAULT 'Alex Carter',
  `author_role` VARCHAR(255) NOT NULL DEFAULT 'Full-Stack Developer',
  `author_email` VARCHAR(255) NOT NULL DEFAULT 'hello@alexcarter.dev',
  `author_github` VARCHAR(255) NOT NULL DEFAULT 'https://github.com/alexcarter',
  `author_linkedin` VARCHAR(255) NOT NULL DEFAULT 'https://linkedin.com/in/alexcarter',
  `author_website` VARCHAR(255) NOT NULL DEFAULT 'https://alexcarter.dev',
  `author_twitter` VARCHAR(255) NOT NULL DEFAULT '',
  `skew_angle` DECIMAL(5,2) NOT NULL DEFAULT -28.00,
  `custom_css` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Table: categories (Kategori / Series Proyek)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: works (Daftar Proyek / Karya Portofolio)
CREATE TABLE IF NOT EXISTS `works` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `series` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `en` VARCHAR(255) NOT NULL DEFAULT '',
  `desc` TEXT NOT NULL,
  `src` VARCHAR(500) NOT NULL,
  `link` VARCHAR(500) NOT NULL DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_series` (`series`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_sort` (`sort_order`)
);

-- 4. Table: admins (Akun Pengelola / Admin)
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
