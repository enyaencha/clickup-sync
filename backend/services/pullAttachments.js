// backend/services/pullAttachments.js
class PullAttachments {
    constructor(db, clickupAPI) {
        this.db = db;
        this.api = clickupAPI;
    }

    async pull(taskId, clickupTaskId) {
        console.log(`Pulling attachments for task ${taskId} (${clickupTaskId})...`);

        try {
            const response = await this.api.makeRequest('GET', `/task/${clickupTaskId}`);
            const attachments = response.attachments || [];

            for (const a of attachments) {
                let uploaderId = null;

                if (a.user) {
                    // Upsert user
                    await this.db.query(
                        `INSERT INTO users (clickup_id, username, local_created_at, local_updated_at, sync_status, last_sync_at)
                         VALUES (?, ?, NOW(), NOW(), 'synced', NOW())
                         ON DUPLICATE KEY UPDATE
                            username = VALUES(username),
                            local_updated_at = NOW(),
                            last_sync_at = NOW()`,
                        [a.user.id, a.user.username || '']
                    );

                    // Get the local DB user.id
                    const [rows] = await this.db.query(
                        `SELECT id FROM users WHERE clickup_id = ? LIMIT 1`,
                        [a.user.id]
                    );

                    if (rows.length > 0) {
                        uploaderId = rows[0].id;
                    }
                }

                // Normalize all values to avoid undefined
                const attachmentType = a.type || 'file';
                const attachmentTitle = a.title || a.name || '';
                const attachmentUrl = a.url || '';
                const attachmentUserId = uploaderId !== undefined ? uploaderId : null;

                await this.db.query(
                    `INSERT INTO attachments (
                        clickup_id, task_id, user_id, attachment_type, title, url,
                        local_created_at, local_updated_at, sync_status, last_sync_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 'synced', NOW())
                    ON DUPLICATE KEY UPDATE
                        attachment_type = VALUES(attachment_type),
                        title = VALUES(title),
                        url = VALUES(url),
                        user_id = VALUES(user_id),
                        local_updated_at = NOW(),
                        sync_status = 'synced',
                        last_sync_at = NOW()`,
                    [
                        a.id,
                        taskId,
                        attachmentUserId,
                        attachmentType,
                        attachmentTitle,
                        attachmentUrl
                    ]
                );
            }

            console.log(`✔ Pulled ${attachments.length} attachments for task ${taskId}`);
        } catch (error) {
            console.error(`❌ Failed to pull attachments for task ${taskId}:`, error);
        }
    }
}

module.exports = PullAttachments;
