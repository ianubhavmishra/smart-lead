import cron from 'node-cron';
import Lead from '../models/Lead.js';

export const startCronJob = () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Running CRM Sync Job...');

        try {
            const leadsToSync = await Lead.find({ status: 'Verified', synced: false });
            if (leadsToSync.length === 0) {
                console.log('No new verified leads to sync.');
                return;
            }
            for (const lead of leadsToSync) {
                console.log(`[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`);
                lead.synced = true;
                await lead.save();
            }
            console.log(`Synced ${leadsToSync.length} leads.`);
        } catch (error) {
            console.error('Error in CRM Sync Job:', error);
        }
    });
};
