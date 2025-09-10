// backend/services/pullGoals.js
class PullGoals {
    constructor(db, clickupAPI) {
        this.db = db;
        this.api = clickupAPI;
    }

    async pull(teamId, clickupTeamId) {
        console.log(`Pulling goals for team ${teamId} (${clickupTeamId})...`);

        try {
            const response = await this.api.makeRequest('GET', `/team/${clickupTeamId}/goal`);
            const goals = response.goals || [];

            for (const g of goals) {
                await this.db.query(
                    `INSERT INTO goals (
                        clickup_id, team_id, name, description, due_date,
                        clickup_created_at, clickup_updated_at,
                        local_created_at, local_updated_at,
                        sync_status, last_sync_at
                    )
                    VALUES (?, ?, ?, ?, FROM_UNIXTIME(?/1000),
                            FROM_UNIXTIME(?/1000), FROM_UNIXTIME(?/1000),
                            NOW(), NOW(), 'synced', NOW())
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        description = VALUES(description),
                        due_date = VALUES(due_date),
                        clickup_created_at = VALUES(clickup_created_at),
                        clickup_updated_at = VALUES(clickup_updated_at),
                        local_updated_at = NOW(),
                        sync_status = 'synced',
                        last_sync_at = NOW()`,
                    [
                        g.id,
                        teamId,
                        g.name,
                        g.description || '',
                        g.due_date,
                        g.date_created,
                        g.date_updated
                    ]
                );
            }

            console.log(`✔ Pulled ${goals.length} goals for team ${teamId}`);
        } catch (error) {
            console.error(`❌ Failed to pull goals for team ${teamId}:`, error);
        }
    }
}

module.exports = PullGoals;
