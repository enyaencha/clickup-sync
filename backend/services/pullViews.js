// backend/services/pullViews.js
class PullViews {
    constructor(db, clickupAPI) {
        this.db = db;
        this.api = clickupAPI;
    }

    async pull(listId, clickupListId) {
        console.log(`Pulling views for list ${listId} (${clickupListId})...`);

        try {
            const response = await this.api.makeRequest('GET', `/list/${clickupListId}/view`);
            const views = response.views || [];

            for (const v of views) {
                await this.db.query(
                    `INSERT INTO views (
                        clickup_id, list_id, name, type, order_index,
                        local_created_at, local_updated_at, sync_status, last_sync_at
                    )
                    VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 'synced', NOW())
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        type = VALUES(type),
                        order_index = VALUES(order_index),
                        local_updated_at = NOW(),
                        sync_status = 'synced',
                        last_sync_at = NOW()`,
                    [
                        v.id,
                        listId,
                        v.name,
                        v.type,
                        v.orderindex || 0
                    ]
                );
            }

            console.log(`✔ Pulled ${views.length} views for list ${listId}`);
        } catch (error) {
            console.error(`❌ Failed to pull views for list ${listId}:`, error);
        }
    }
}

module.exports = PullViews;
