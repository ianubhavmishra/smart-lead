import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    country: {
        type: String,
    },
    probability: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['Verified', 'To Check'],
        default: 'To Check',
    },
    synced: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Lead', LeadSchema);
