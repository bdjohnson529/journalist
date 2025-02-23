CREATE TABLE transcriptions (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    original_files TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add an index for faster date-based queries
CREATE INDEX idx_transcriptions_created_at ON transcriptions(created_at); 