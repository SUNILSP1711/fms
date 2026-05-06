-- ============================================================
-- Facility Management System - Seed Data
-- ============================================================
-- NOTE: Passwords are BCrypt hashed. Plain text:
--   admin@fms.com  → password: Admin@123
--   staff1@fms.com → password: Staff@123
--   staff2@fms.com → password: Staff@123
-- ============================================================

-- USERS
INSERT INTO users (name, email, password, role) VALUES
('System Admin',    'admin@fms.com',   '$2a$12$7KnNdLNDfkJrQMTw7GaDBuuJQFLiHHsJXnvVm.w54jt9S52S2z8vy', 'ADMIN'),
('Alice Johnson',   'staff1@fms.com',  '$2a$12$sJZVtnxMFD/5KBvSrOnVqurN8Xp3Yp.ZpA7lMakv/A8r34vmXRVi.', 'STAFF'),
('Bob Martinez',    'staff2@fms.com',  '$2a$12$sJZVtnxMFD/5KBvSrOnVqurN8Xp3Yp.ZpA7lMakv/A8r34vmXRVi.', 'STAFF');

-- FACILITIES
INSERT INTO facilities (name, description, location, capacity, status, image_url) VALUES
('Main Conference Room',  'Large conference room with projector and whiteboard.',    'Building A, Floor 2', 20, 'AVAILABLE',    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'),
('Training Lab',          'Computer lab with 30 workstations for training sessions.','Building B, Floor 1', 30, 'AVAILABLE',    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800'),
('Executive Boardroom',   'Premium boardroom with HD video conferencing.',           'Building A, Floor 4', 12, 'AVAILABLE',    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800'),
('Gymnasium',             'Fully equipped gymnasium for staff wellness.',            'Building C, Floor 1', 50, 'AVAILABLE',    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'),
('Rooftop Lounge',        'Open rooftop area for informal meetings and breaks.',     'Building A, Rooftop', 25, 'MAINTENANCE',  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
('Auditorium',            '200-seat auditorium for company-wide events.',            'Building D, Floor 1',200, 'AVAILABLE',    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800');

-- BOOKINGS
INSERT INTO bookings (user_id, facility_id, start_date, end_date, start_time, end_time, purpose, status) VALUES
(2, 1, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '1 day', '09:00', '11:00', 'Quarterly review meeting',         'APPROVED'),
(2, 3, CURRENT_DATE + INTERVAL '2 day', CURRENT_DATE + INTERVAL '2 day', '14:00', '16:00', 'Client presentation',               'PENDING'),
(3, 2, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '1 day', '10:00', '12:00', 'New employee onboarding training',  'APPROVED'),
(3, 6, CURRENT_DATE + INTERVAL '7 day', CURRENT_DATE + INTERVAL '7 day', '09:00', '17:00', 'Annual company town hall',          'PENDING');

-- ISSUES
INSERT INTO issues (reporter_id, facility_id, title, description, priority, status) VALUES
(2, 1, 'Projector not working',      'The projector in Main Conference Room fails to connect via HDMI.',   'HIGH',     'OPEN'),
(3, 2, 'AC unit making noise',       'Air conditioning unit in Training Lab is making loud rattling noise.','MEDIUM',   'IN_PROGRESS'),
(2, 4, 'Treadmill belt slipping',    'The second treadmill belt slips during use — safety hazard.',         'CRITICAL', 'OPEN'),
(3, 6, 'Microphone feedback issue',  'Audio system produces feedback when using wireless mics.',            'MEDIUM',   'RESOLVED');
