CREATE TABLE shorts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(200),
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE short_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    short_id INTEGER NOT NULL REFERENCES shorts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, short_id)
);

CREATE INDEX idx_shorts_user_id ON shorts(user_id);
CREATE INDEX idx_shorts_created_at ON shorts(created_at DESC);
CREATE INDEX idx_short_likes_short_id ON short_likes(short_id);
CREATE INDEX idx_short_likes_user_id ON short_likes(user_id);