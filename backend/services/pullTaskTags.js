// backend/services/pullTaskTags.js
class PullTaskTags {
    constructor(db, clickupAPI) {
        this.db = db;
        this.api = clickupAPI;
    }

    async pull(taskId, clickupTaskId, spaceId) {
        console.log(`Pulling tags for task ${taskId} (${clickupTaskId})...`);

        try {
            const task = await this.api.makeRequest('GET', `/task/${clickupTaskId}`);
            // Safely default tags to empty array
            const tags = Array.isArray(task.tags) ? task.tags : [];

            for (const t of tags) {
                const tagClickupId = t.name;
                if (!tagClickupId) continue; // skip invalid tags

                const tagName = t.name || '';
                const tagFg = t.tag_fg || null;
                const clickupCreatedAt = t.date_created ? new Date(Number(t.date_created)) : null;
                const clickupUpdatedAt = t.date_updated ? new Date(Number(t.date_updated)) : null;

                // Ensure tag exists globally
                const [rows] = await this.db.query(
                    'SELECT id FROM tags WHERE clickup_id = ?',
                    [tagClickupId]
                );

                let tagId;
                if (rows.length) {
                    tagId = rows[0].id;
                    // Optionally update the tag info
                    await this.db.query(
                        `UPDATE tags
                         SET name = ?, tag_fg = ?, clickup_updated_at = ?, 
                             local_updated_at = NOW(), sync_status = 'synced', last_sync_at = NOW()
                         WHERE id = ?`,
                        [tagName, tagFg, clickupUpdatedAt, tagId]
                    );
                } else {
                    const result = await this.db.query(
                        `INSERT INTO tags (
                            clickup_id, space_id, name, tag_fg,
                            clickup_created_at, clickup_updated_at,
                            local_created_at, local_updated_at,
                            sync_status, last_sync_at
                        )
                        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 'synced', NOW())`,
                        [
                            tagClickupId,
                            spaceId || null, // allow null
                            tagName,
                            tagFg,
                            clickupCreatedAt,
                            clickupUpdatedAt
                        ]
                    );
                    tagId = result.insertId;
                }

                // Link tag to task
                await this.db.query(
                    `INSERT INTO task_tags (
                        task_id, tag_id, tagged_at,
                        clickup_created_at, clickup_updated_at,
                        local_created_at, local_updated_at,
                        sync_status, last_sync_at
                    )
                    VALUES (?, ?, NOW(), ?, ?, NOW(), NOW(), 'synced', NOW())
                    ON DUPLICATE KEY UPDATE
                        tagged_at = NOW(),
                        clickup_updated_at = VALUES(clickup_updated_at),
                        local_updated_at = NOW(),
                        sync_status = 'synced',
                        last_sync_at = NOW()`,
                    [
                        taskId,
                        tagId,
                        clickupCreatedAt,
                        clickupUpdatedAt
                    ]
                );
            }

            console.log(`✔ Pulled ${tags.length} tags for task ${taskId}`);
        } catch (error) {
            console.error(`❌ Failed to pull tags for task ${taskId}:`, error);
        }
    }
}

module.exports = PullTaskTags;
