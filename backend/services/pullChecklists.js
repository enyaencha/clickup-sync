class PullChecklists {
    constructor(db, clickupAPI) {
        this.db = db;
        this.api = clickupAPI;
    }

    async pull(taskId, clickupTaskId) {
        console.log(`Pulling checklists for task ${taskId} (${clickupTaskId})...`);

        try {
            const response = await this.api.makeRequest('GET', `/task/${clickupTaskId}/checklist`);
            const checklists = response.checklists || [];

            for (const c of checklists) {
                await this.db.query(
                    `INSERT INTO checklists (
                        clickup_id, task_id, name, order_index, resolved, local_created_at, local_updated_at,
                        sync_status, last_sync_at
                    )
                    VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 'synced', NOW())
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        order_index = VALUES(order_index),
                        resolved = VALUES(resolved),
                        local_updated_at = NOW(),
                        sync_status = 'synced',
                        last_sync_at = NOW()`,
                    [
                        c.id,
                        taskId,
                        c.name,
                        c.orderindex || 0,
                        c.resolved ? 1 : 0
                    ]
                );

                // Insert checklist items
                for (const item of c.items || []) {
                    await this.db.query(
                        `INSERT INTO checklist_items (
                            clickup_id, checklist_id, name, resolved, order_index, local_created_at, local_updated_at,
                            sync_status, last_sync_at
                        )
                        VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 'synced', NOW())
                        ON DUPLICATE KEY UPDATE
                            name = VALUES(name),
                            resolved = VALUES(resolved),
                            order_index = VALUES(order_index),
                            local_updated_at = NOW(),
                            sync_status = 'synced',
                            last_sync_at = NOW()`,
                        [
                            item.id,
                            c.id,
                            item.name,
                            item.resolved ? 1 : 0,
                            item.orderindex || 0
                        ]
                    );
                }
            }

            console.log(`✔ Pulled ${checklists.length} checklists for task ${taskId}`);
        } catch (error) {
            if (error.message.includes('404')) {
                console.log(`⚠ No checklists found for task ${taskId}, skipping.`);
            } else {
                console.error(`❌ Failed to pull checklists for task ${taskId}:`, error);
            }
        }
    }
}

module.exports = PullChecklists;
