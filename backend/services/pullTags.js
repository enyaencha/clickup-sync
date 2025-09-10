// backend/services/pullTags.js
class PullTags {
    constructor(db, clickupAPI) {
        this.db = db;
        this.api = clickupAPI;
    }

    async pull(spaceId, clickupSpaceId) {
        console.log(`Pulling tags for space ${spaceId} (${clickupSpaceId})...`);

        try {
            const response = await this.api.makeRequest('GET', `/space/${clickupSpaceId}/tag`);
            const tags = response.tags || [];

            for (const t of tags) {
                await this.db.query(
                    `INSERT INTO tags (
                        clickup_id, space_id, name, tag_fg,
                        clickup_created_at, clickup_updated_at,
                        local_created_at, local_updated_at,
                        sync_status, last_sync_at
                    )
                    VALUES (?, ?, ?, ?, FROM_UNIXTIME(?/1000), FROM_UNIXTIME(?/1000), NOW(), NOW(), 'synced', NOW())
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        tag_fg = VALUES(tag_fg),
                        clickup_updated_at = VALUES(clickup_updated_at),
                        local_updated_at = NOW(),
                        sync_status = 'synced',
                        last_sync_at = NOW()`,
                    [
                        t.name,         // clickup_id
                        spaceId,        // FK
                        t.name,         // display name
                        t.tag_fg || '', // optional tag color/flag
                        t.date_created || null,
                        t.date_updated || null
                    ]
                );
            }

            console.log(`✔ Pulled ${tags.length} tags for space ${spaceId}`);
        } catch (error) {
            console.error(`❌ Failed to pull tags for space ${spaceId}:`, error);
        }
    }
}

module.exports = PullTags;
