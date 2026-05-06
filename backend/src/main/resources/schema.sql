-- ============================================================
-- Facility Management System - PostgreSQL Schema
-- ============================================================

-- Drop tables if they exist (for clean rerun)
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS users;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,
    role        VARCHAR(20)         NOT NULL DEFAULT 'STAFF' CHECK (role IN ('ADMIN','STAFF')),
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- FACILITIES TABLE
-- ============================================================
CREATE TABLE facilities (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150)        NOT NULL,
    description TEXT,
    location    VARCHAR(200)        NOT NULL,
    capacity    INT                 NOT NULL DEFAULT 1,
    status      VARCHAR(20)         NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE','UNAVAILABLE','MAINTENANCE')),
    image_url   TEXT,
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE bookings (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT              NOT NULL,
    facility_id BIGINT              NOT NULL,
    start_date  DATE                NOT NULL,
    end_date    DATE                NOT NULL,
    start_time  TIME                NOT NULL,
    end_time    TIME                NOT NULL,
    purpose     TEXT,
    status      VARCHAR(20)         NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','CANCELLED')),
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    CHECK (end_date >= start_date)
);

-- ============================================================
-- ISSUES TABLE
-- ============================================================
CREATE TABLE issues (
    id          BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT              NOT NULL,
    facility_id BIGINT              NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    description TEXT                NOT NULL,
    priority    VARCHAR(20)         NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW','MEDIUM','HIGH','CRITICAL')),
    status      VARCHAR(20)         NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','IN_PROGRESS','RESOLVED','CLOSED')),
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_bookings_user_id     ON bookings(user_id);
CREATE INDEX idx_bookings_facility_id ON bookings(facility_id);
CREATE INDEX idx_bookings_status      ON bookings(status);
CREATE INDEX idx_issues_facility_id   ON issues(facility_id);
CREATE INDEX idx_issues_reporter_id   ON issues(reporter_id);
CREATE INDEX idx_issues_status        ON issues(status);
