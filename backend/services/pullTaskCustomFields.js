// backend/services/pullTaskCustomFields.js
class PullTaskCustomFields {
    constructor(db, clickupAPI) {
        this.db = db;
        this.api = clickupAPI;
    }

    async pull(taskId, clickupTaskId) {
        console.log(`Pulling custom field values for task ${taskId} (${clickupTaskId})...`);

        try {
            const response = await this.api.makeRequest('GET',`/task/${clickupTaskId}`);

            const fields = response.custom_fields || [];

            for (const f of fields) {
                await this.db.query(
                    `INSERT INTO task_custom_fields (
            task_id, custom_field_id, value_text, value_number, 
            value_date, value_boolean, value_json, 
            local_created_at, local_updated_at, sync_status, last_sync_at
          )
          VALUES (?, 
            (SELECT id FROM custom_fields WHERE clickup_id = ? LIMIT 1),
            ?, ?, ?, ?, ?, NOW(), NOW(), 'synced', NOW()
          )
          ON DUPLICATE KEY UPDATE
            value_text = VALUES(value_text),
            value_number = VALUES(value_number),
            value_date = VALUES(value_date),
            value_boolean = VALUES(value_boolean),
            value_json = VALUES(value_json),
            local_updated_at = NOW(),
            sync_status = 'synced',
            last_sync_at = NOW()`,
                    [
                        taskId,
                        f.id,
                        f.value || null,
                        typeof f.value === 'number' ? f.value : null,
                        f.type === 'date' ? new Date(f.value) : null,
                        f.type === 'checkbox' ? (f.value ? 1 : 0) : null,
                        f.type === 'json' ? JSON.stringify(f.value) : null
                    ]
                );
            }

            console.log(`✔ Pulled ${fields.length} custom field values for task ${taskId}`);
        } catch (error) {
            console.error(`❌ Failed to pull custom field values for task ${taskId}:`, error);
        }
    }
}

module.exports = PullTaskCustomFields;
