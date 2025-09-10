// backend/services/pullCustomFields.js
class PullCustomFields {
    constructor(db, clickupAPI) {
        this.db = db;
        this.api = clickupAPI;
    }

    async pull(listId, clickupListId) {
        console.log(`Pulling custom fields for list ${listId} (${clickupListId})...`);

        try {
            //const response = await this.api.get(`/list/${clickupListId}/field`);
            const response = await this.api.makeRequest('GET',`/list/${clickupListId}/field`);
            const fields = response.fields || [];

            for (const f of fields) {
                await this.db.query(
                    `INSERT INTO custom_fields (
            clickup_id, list_id, name, type, type_config,
            is_required, is_active, clickup_created_at, clickup_updated_at, 
            sync_status, last_sync_at
          )
          VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW(), 'synced', NOW())
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            type = VALUES(type),
            type_config = VALUES(type_config),
            is_required = VALUES(is_required),
            is_active = 1,
            local_updated_at = NOW(),
            sync_status = 'synced',
            last_sync_at = NOW()`,
                    [
                        f.id,
                        listId,
                        f.name,
                        f.type,
                        JSON.stringify(f.type_config || {}),
                        f.required ? 1 : 0
                    ]
                );
            }

            console.log(`✔ Pulled ${fields.length} custom fields for list ${listId}`);
        } catch (error) {
            console.error(`❌ Failed to pull custom fields for list ${listId}:`, error);
        }
    }
}

module.exports = PullCustomFields;
