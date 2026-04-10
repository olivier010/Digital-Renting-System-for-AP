CREATE TABLE IF NOT EXISTS payment_methods (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand VARCHAR(50) NOT NULL,
    card_last_four VARCHAR(4) NOT NULL,
    expiry_month VARCHAR(2) NOT NULL,
    expiry_year VARCHAR(4) NOT NULL,
    card_holder_name VARCHAR(100),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id
    ON payment_methods(user_id);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_is_active
    ON payment_methods(user_id, is_active);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_is_default
    ON payment_methods(user_id, is_default);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_methods_user_last4
    ON payment_methods(user_id, card_last_four);
