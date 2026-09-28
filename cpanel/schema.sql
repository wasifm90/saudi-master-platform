-- =====================================================================
-- SAUDI MASTER COMPANY (ULMA ALLIANCE) - MYSQL 8.X PRODUCTION SCHEMA
-- Fully relational, bilingual-ready, audit-tracked, cPanel-compatible
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS lead_activities;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS page_sections;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS assembly_steps;
DROP TABLE IF EXISTS assembly_sequences;
DROP TABLE IF EXISTS hotspots;
DROP TABLE IF EXISTS product_applications;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS service_region_capabilities;
DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS project_products;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS manufacturing_processes;
DROP TABLE IF EXISTS manufacturing_facilities;
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS product_classifications;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS & ROLES
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'PRODUCT_EDITOR', 'PROJECT_EDITOR', 'MEDIA_EDITOR', 'VIEWER') DEFAULT 'ADMIN',
    avatar VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SITE SETTINGS (GLOBAL SINGLE SOURCE OF TRUTH)
CREATE TABLE site_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSON NOT NULL,
    description VARCHAR(255) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PRODUCT CLASSIFICATIONS (LOCAL / EUROPEAN / OTHER)
CREATE TABLE product_classifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, -- 'LOCAL', 'EUROPEAN', 'OTHER'
    name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description_en TEXT NULL,
    description_ar TEXT NULL,
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BRANDS (Saudi Master, ULMA, etc.)
CREATE TABLE brands (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    country_of_origin VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500) NULL,
    website VARCHAR(255) NULL,
    description_en TEXT NULL,
    description_ar TEXT NULL,
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CATEGORIES
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT UNSIGNED NULL,
    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description_en TEXT NULL,
    description_ar TEXT NULL,
    image_url VARCHAR(500) NULL,
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PRODUCTS (COMPLETE TECHNICAL & EDUCATIONAL PROFILE)
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    classification_id BIGINT UNSIGNED NOT NULL,
    brand_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(100) NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    name_en VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    tagline_en VARCHAR(255) NULL,
    tagline_ar VARCHAR(255) NULL,
    short_summary_en TEXT NOT NULL,
    short_summary_ar TEXT NOT NULL,
    what_is_it_en TEXT NOT NULL,
    what_is_it_ar TEXT NOT NULL,
    what_is_used_for_en TEXT NOT NULL,
    what_is_used_for_ar TEXT NOT NULL,
    how_does_it_work_en TEXT NOT NULL,
    how_does_it_work_ar TEXT NOT NULL,
    key_advantages_en JSON NULL,
    key_advantages_ar JSON NULL,
    main_components_en JSON NULL,
    main_components_ar JSON NULL,
    technical_specs JSON NOT NULL,
    sales_available TINYINT(1) DEFAULT 1,
    rental_available TINYINT(1) DEFAULT 1,
    regional_availability JSON NULL,
    hero_image VARCHAR(500) NOT NULL,
    main_image VARCHAR(500) NOT NULL,
    drawing_url VARCHAR(500) NULL,
    brochure_url VARCHAR(500) NULL,
    video_url VARCHAR(500) NULL,
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'PUBLISHED',
    featured TINYINT(1) DEFAULT 0,
    display_order INT DEFAULT 0,
    meta_title_en VARCHAR(255) NULL,
    meta_title_ar VARCHAR(255) NULL,
    meta_desc_en TEXT NULL,
    meta_desc_ar TEXT NULL,
    created_by BIGINT UNSIGNED NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (classification_id) REFERENCES product_classifications(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. APPLICATIONS
CREATE TABLE applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description_en TEXT NULL,
    description_ar TEXT NULL,
    icon_name VARCHAR(100) DEFAULT 'architecture',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_applications (
    product_id BIGINT UNSIGNED NOT NULL,
    application_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (product_id, application_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ASSEMBLY SEQUENCES & STEPS
CREATE TABLE assembly_sequences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    title_ar VARCHAR(200) NOT NULL,
    description_en TEXT NULL,
    description_ar TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE assembly_steps (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sequence_id BIGINT UNSIGNED NOT NULL,
    step_number INT NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    title_ar VARCHAR(200) NOT NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    spec_a_label VARCHAR(100) NULL,
    spec_a_value VARCHAR(100) NULL,
    spec_b_label VARCHAR(100) NULL,
    spec_b_value VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sequence_id) REFERENCES assembly_sequences(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. HOTSPOTS
CREATE TABLE hotspots (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NULL,
    target_identifier VARCHAR(100) NOT NULL,
    node_number INT NOT NULL,
    x_percent DECIMAL(5,2) NOT NULL,
    y_percent DECIMAL(5,2) NOT NULL,
    category_en VARCHAR(100) NOT NULL,
    category_ar VARCHAR(100) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    title_ar VARCHAR(200) NOT NULL,
    rating VARCHAR(100) NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    specifications JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. REGIONS & MATRIX
CREATE TABLE regions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    sales_allowed TINYINT(1) DEFAULT 1,
    rental_allowed TINYINT(1) DEFAULT 0,
    supervision_allowed TINYINT(1) DEFAULT 1,
    description_en TEXT NULL,
    description_ar TEXT NULL,
    hub_locations JSON NULL,
    is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. SERVICES
CREATE TABLE services (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    summary_en TEXT NOT NULL,
    summary_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    icon_name VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NULL,
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. PROJECTS
CREATE TABLE projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    location_en VARCHAR(150) NOT NULL,
    location_ar VARCHAR(150) NOT NULL,
    region_code VARCHAR(50) NOT NULL,
    industry_en VARCHAR(100) NOT NULL,
    industry_ar VARCHAR(100) NOT NULL,
    hero_image VARCHAR(500) NOT NULL,
    summary_en TEXT NOT NULL,
    summary_ar TEXT NOT NULL,
    challenge_en TEXT NOT NULL,
    challenge_ar TEXT NOT NULL,
    solution_en TEXT NOT NULL,
    solution_ar TEXT NOT NULL,
    execution_en TEXT NOT NULL,
    execution_ar TEXT NOT NULL,
    results_en TEXT NOT NULL,
    results_ar TEXT NOT NULL,
    key_metrics JSON NULL,
    gallery JSON NULL,
    status ENUM('DRAFT', 'PUBLISHED') DEFAULT 'PUBLISHED',
    featured TINYINT(1) DEFAULT 1,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE project_products (
    project_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (project_id, product_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. MANUFACTURING
CREATE TABLE manufacturing_facilities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    location_en VARCHAR(200) NOT NULL,
    location_ar VARCHAR(200) NOT NULL,
    iktva_score VARCHAR(50) DEFAULT '85%',
    overview_en TEXT NOT NULL,
    overview_ar TEXT NOT NULL,
    capabilities JSON NOT NULL,
    hero_image VARCHAR(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE manufacturing_processes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    step_number INT NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    summary_en TEXT NOT NULL,
    summary_ar TEXT NOT NULL,
    details_en TEXT NOT NULL,
    details_ar TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    step_tag VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. PAGES & SECTIONS
CREATE TABLE pages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title_en VARCHAR(200) NOT NULL,
    title_ar VARCHAR(200) NOT NULL,
    meta_title_en VARCHAR(255) NULL,
    meta_title_ar VARCHAR(255) NULL,
    meta_desc_en TEXT NULL,
    meta_desc_ar TEXT NULL,
    status ENUM('DRAFT', 'PUBLISHED') DEFAULT 'PUBLISHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE page_sections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    page_id BIGINT UNSIGNED NOT NULL,
    section_type VARCHAR(100) NOT NULL,
    section_key VARCHAR(100) NOT NULL,
    title_en VARCHAR(255) NULL,
    title_ar VARCHAR(255) NULL,
    subtitle_en VARCHAR(255) NULL,
    subtitle_ar VARCHAR(255) NULL,
    body_en TEXT NULL,
    body_ar TEXT NULL,
    cta_label_en VARCHAR(100) NULL,
    cta_label_ar VARCHAR(100) NULL,
    cta_url VARCHAR(255) NULL,
    custom_config JSON NULL,
    display_order INT DEFAULT 0,
    is_visible TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. LEADS
CREATE TABLE leads (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    lead_type ENUM('RFQ', 'CONTACT', 'RENTAL', 'SALES', 'DRAWING_UPLOAD', 'CONSULTATION') DEFAULT 'RFQ',
    full_name VARCHAR(200) NOT NULL,
    company_name VARCHAR(200) NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    project_name VARCHAR(255) NULL,
    project_location VARCHAR(255) NULL,
    system_interest VARCHAR(200) NULL,
    transaction_type ENUM('RENTAL', 'PURCHASE', 'SUPERVISION', 'UNSPECIFIED') DEFAULT 'UNSPECIFIED',
    quantity_estimate VARCHAR(100) NULL,
    rental_duration VARCHAR(100) NULL,
    message TEXT NULL,
    attachment_name VARCHAR(255) NULL,
    attachment_url VARCHAR(500) NULL,
    region_code VARCHAR(50) DEFAULT 'KSA',
    language VARCHAR(10) DEFAULT 'en',
    status ENUM('NEW', 'IN_REVIEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'ARCHIVED') DEFAULT 'NEW',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. AUDIT LOGS
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

