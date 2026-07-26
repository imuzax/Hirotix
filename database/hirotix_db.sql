-- Hirotix Database Schema
-- Generated for MySQL 8.0+

CREATE DATABASE IF NOT EXISTS hirotix_db;
USE hirotix_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) -- ADMIN, RECRUITER, JOB_SEEKER
);

-- 2. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    description TEXT,
    responsibilities TEXT,
    requirements TEXT,
    qualifications TEXT,
    salary VARCHAR(255),
    job_type VARCHAR(50), -- FULL_TIME, PART_TIME, CONTRACT
    experience_level VARCHAR(50), -- ENTRY, MID, SENIOR
    posted_date DATETIME,
    recruiter_id BIGINT,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    headline VARCHAR(255),
    skills VARCHAR(255),
    education VARCHAR(255),
    experience VARCHAR(255),
    location VARCHAR(255),
    github_link VARCHAR(255),
    resume_file_path VARCHAR(255),
    user_id BIGINT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seeker_id BIGINT,
    job_id BIGINT,
    status VARCHAR(50), -- APPLIED, SHORTLISTED, REJECTED
    applied_date DATETIME,
    match_score DOUBLE,
    FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 5. Seed Default Admin Account
-- Password 'admin123' (As per Project Guide)
INSERT INTO users (full_name, email, password, role) 
VALUES ('System Administrator', 'admin@hirotix.com', 'admin123', 'ADMIN')
ON DUPLICATE KEY UPDATE email=email;
