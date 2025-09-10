class PullStatuses {
    constructor(db, clickupAPI) {
        this.db = db;
        this.api = clickupAPI;
    }

    async pull(list) {
        console.log(`Pulling statuses for list ${list.id} (${list.clickup_id})...`);

        try {
            let response;

            if (list.folder_id) {
                // Try folder-level statuses
                response = await this.api.makeRequest('GET', `/folder/${list.folder_id}/status`);
            } else if (list.space_id) {
                // Fallback to space-level statuses
                response = await this.api.makeRequest('GET', `/space/${list.space_id}/status`);
            } else {
                console.warn(`⚠ No folder_id or space_id for list ${list.id}, skipping statuses`);
                return;
            }

            const statuses = response.statuses || [];

            for (const s of statuses) {
                await this.db.query(
                    `INSERT INTO statuses (
                        clickup_id, space_id, status, type, order_index,
                        color, local_created_at, local_updated_at,
                        sync_status, last_sync_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 'synced', NOW())
                    ON DUPLICATE KEY UPDATE
                        status = VALUES(status),
                        type = VALUES(type),
                        order_index = VALUES(order_index),
                        color = VALUES(color),
                        local_updated_at = NOW(),
                        sync_status = 'synced',
                        last_sync_at = NOW()`,
                    [
                        s.id || s.status,
                        list.space_id,
                        s.status,
                        s.type,
                        s.orderindex || 0,
                        s.color || null
                    ]
                );
            }

            console.log(`✔ Pulled ${statuses.length} statuses for list ${list.id}`);
        } catch (error) {
            console.error(`❌ Failed to pull statuses for list ${list.id}:`, error);
        }
    }
}

module.exports = PullStatuses;
