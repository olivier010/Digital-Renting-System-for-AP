CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_role VARCHAR(20) NOT NULL,
    type VARCHAR(60) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    actor_user_id BIGINT NULL,
    entity_type VARCHAR(30) NULL,
    entity_id BIGINT NULL,
    metadata TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_created_at
    ON notifications(recipient_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread
    ON notifications(recipient_user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_type
    ON notifications(type);

