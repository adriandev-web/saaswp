-- WooLanding AI Generator - PostgreSQL Database Schema
-- Version: 1.0.0
-- Date: 2025-12-05

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    company_name VARCHAR(255),
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    stripe_customer_id VARCHAR(255) UNIQUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

-- ============================================================================
-- PLANS TABLE
-- ============================================================================
CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    generation_limit INT NOT NULL,
    features JSONB DEFAULT '{}',
    stripe_price_id_monthly VARCHAR(255),
    stripe_price_id_yearly VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_slug ON plans(slug);
CREATE INDEX idx_plans_active ON plans(is_active);

-- Insert default plans
INSERT INTO plans (name, slug, description, price_monthly, price_yearly, generation_limit, features, sort_order) VALUES
('Free', 'free', 'Perfect for testing', 0, 0, 3, '{"templates": 1, "ai": "mock", "support": "community"}', 1),
('Starter', 'starter', 'Great for small businesses', 49, 470, 50, '{"templates": 3, "ai": "gpt-3.5", "support": "email", "analytics": false}', 2),
('Professional', 'professional', 'For growing businesses', 149, 1430, 200, '{"templates": 10, "ai": "gpt-4", "ab_testing": true, "analytics": true, "support": "priority"}', 3),
('Agency', 'agency', 'For agencies and enterprises', 499, 4790, 1000, '{"templates": "unlimited", "ai": "gpt-4", "white_label": true, "api_access": true, "bulk_generation": true, "support": "dedicated"}', 4);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT NOT NULL REFERENCES plans(id),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing', 'incomplete')),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP,
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE UNIQUE INDEX idx_active_subscription_per_user ON subscriptions(user_id) WHERE status = 'active';

-- ============================================================================
-- API KEYS TABLE
-- ============================================================================
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    name VARCHAR(255),
    last_used_at TIMESTAMP,
    last_ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    website_url TEXT,
    total_requests INT DEFAULT 0
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- ============================================================================
-- GENERATIONS TABLE (History)
-- ============================================================================
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,

    -- Product data
    product_id VARCHAR(100),
    product_name VARCHAR(255),
    product_data JSONB,

    -- Generated content
    ai_response JSONB,
    template_used VARCHAR(100),

    -- WordPress integration
    wordpress_page_id VARCHAR(100),
    wordpress_site_url TEXT,

    -- Status and errors
    status VARCHAR(50) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
    error_message TEXT,

    -- Metrics
    processing_time_ms INT,
    ai_tokens_used INT,
    estimated_cost DECIMAL(10,4),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_generations_user ON generations(user_id, created_at DESC);
CREATE INDEX idx_generations_api_key ON generations(api_key_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created ON generations(created_at DESC);

-- ============================================================================
-- USAGE LIMITS TABLE (Monthly counters)
-- ============================================================================
CREATE TABLE usage_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    generations_count INT DEFAULT 0,
    generations_limit INT NOT NULL,
    ai_tokens_used INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, period_start)
);

CREATE INDEX idx_usage_limits_user ON usage_limits(user_id);
CREATE INDEX idx_usage_limits_period ON usage_limits(period_start, period_end);

-- ============================================================================
-- PAYMENTS TABLE (Transaction history)
-- ============================================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),

    stripe_payment_id VARCHAR(255) UNIQUE,
    stripe_invoice_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PLN',
    status VARCHAR(50) NOT NULL CHECK (status IN ('succeeded', 'failed', 'pending', 'refunded')),

    payment_method VARCHAR(50),
    invoice_url TEXT,
    receipt_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_stripe_payment ON payments(stripe_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================================
-- WEBHOOK EVENTS TABLE (Audit log)
-- ============================================================================
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('stripe', 'paypal', 'other')),
    event_id VARCHAR(255) UNIQUE,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_events_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_created ON webhook_events(created_at DESC);

-- ============================================================================
-- SESSIONS TABLE (JWT refresh tokens)
-- ============================================================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) UNIQUE NOT NULL,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON sessions(user_id, expires_at);
CREATE INDEX idx_sessions_token ON sessions(refresh_token_hash);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================================================
-- USER SETTINGS TABLE
-- ============================================================================
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    -- Preferences
    default_template VARCHAR(100) DEFAULT 'default',
    ai_tone VARCHAR(50) DEFAULT 'professional' CHECK (ai_tone IN ('professional', 'casual', 'enthusiastic')),
    language VARCHAR(10) DEFAULT 'en',

    -- Notifications
    email_notifications BOOLEAN DEFAULT true,
    email_generation_summary BOOLEAN DEFAULT true,
    email_usage_alerts BOOLEAN DEFAULT true,
    email_payment_receipts BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,

    -- Additional settings as JSON
    settings_json JSONB DEFAULT '{}',

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- EMAIL VERIFICATION TOKENS TABLE
-- ============================================================================
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_tokens_user ON email_verification_tokens(user_id);
CREATE INDEX idx_email_tokens_token ON email_verification_tokens(token);
CREATE INDEX idx_email_tokens_expires ON email_verification_tokens(expires_at);

-- ============================================================================
-- PASSWORD RESET TOKENS TABLE
-- ============================================================================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_tokens_expires ON password_reset_tokens(expires_at);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_limits_updated_at
    BEFORE UPDATE ON usage_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default user settings
CREATE OR REPLACE FUNCTION create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_user_settings_on_register
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_default_user_settings();

-- Function to initialize usage limits when subscription is created
CREATE OR REPLACE FUNCTION initialize_usage_limits()
RETURNS TRIGGER AS $$
DECLARE
    plan_limit INT;
BEGIN
    -- Get generation limit from plan
    SELECT generation_limit INTO plan_limit
    FROM plans
    WHERE id = NEW.plan_id;

    -- Create usage limits for current period
    INSERT INTO usage_limits (user_id, period_start, period_end, generations_limit)
    VALUES (
        NEW.user_id,
        DATE_TRUNC('month', CURRENT_DATE),
        DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
        plan_limit
    )
    ON CONFLICT (user_id, period_start) DO UPDATE
    SET generations_limit = plan_limit;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER initialize_usage_on_subscription
    AFTER INSERT OR UPDATE ON subscriptions
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION initialize_usage_limits();

-- ============================================================================
-- VIEWS (Helpful queries)
-- ============================================================================

-- View: Active subscriptions with user and plan details
CREATE VIEW active_subscriptions_view AS
SELECT
    s.id AS subscription_id,
    s.user_id,
    u.email,
    u.name,
    p.name AS plan_name,
    p.slug AS plan_slug,
    p.generation_limit,
    s.status,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end
FROM subscriptions s
JOIN users u ON s.user_id = u.id
JOIN plans p ON s.plan_id = p.id
WHERE s.status = 'active';

-- View: User usage statistics
CREATE VIEW user_usage_stats AS
SELECT
    u.id AS user_id,
    u.email,
    u.name,
    ul.generations_count,
    ul.generations_limit,
    ROUND((ul.generations_count::DECIMAL / ul.generations_limit * 100), 2) AS usage_percentage,
    ul.period_start,
    ul.period_end,
    (ul.period_end - CURRENT_DATE) AS days_until_reset
FROM users u
LEFT JOIN usage_limits ul ON u.id = ul.user_id
WHERE ul.period_start <= CURRENT_DATE AND ul.period_end >= CURRENT_DATE;

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE users IS 'Application users and their profile information';
COMMENT ON TABLE plans IS 'Subscription plans with pricing and features';
COMMENT ON TABLE subscriptions IS 'User subscriptions linked to Stripe';
COMMENT ON TABLE api_keys IS 'API keys for WordPress plugin authentication';
COMMENT ON TABLE generations IS 'History of all landing page generations';
COMMENT ON TABLE usage_limits IS 'Monthly generation limits per user';
COMMENT ON TABLE payments IS 'Payment transaction history';
COMMENT ON TABLE webhook_events IS 'Audit log for webhook events';
COMMENT ON TABLE sessions IS 'JWT refresh tokens for user sessions';
COMMENT ON TABLE user_settings IS 'User preferences and settings';

-- ============================================================================
-- SAMPLE DATA (Development only - remove in production)
-- ============================================================================

-- Sample user (password: "password123" - bcrypt hash)
-- INSERT INTO users (email, password_hash, name, email_verified_at)
-- VALUES (
--     'demo@woolanding.com',
--     '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLhI3Pge',
--     'Demo User',
--     CURRENT_TIMESTAMP
-- );
