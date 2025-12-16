import Lead from '../models/Lead.js';
import { processBatch as _processBatch } from '../services/enrichmentService.js';

export const createBatch = async (req, res) => {
    try {
        const { names } = req.body;

        if (!names || !Array.isArray(names) || names.length === 0) {
            return res.status(400).json({ error: 'Invalid input. Please provide a list of names.' });
        }

        const enrichedData = await _processBatch(names);

        const leadsToSave = enrichedData.map(item => {
            let status = 'To Check';
            if (item.probability > 0.6) {
                status = 'Verified';
            }

            return {
                name: item.name,
                country: item.country,
                probability: item.probability,
                status,
                synced: false
            };
        });

        const savedLeads = await Lead.insertMany(leadsToSave);

        res.status(201).json(savedLeads);
    } catch (error) {
        console.error('Error processing batch:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLeads = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) {
            query.status = status;
        }

        const leads = await Lead.find(query).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
