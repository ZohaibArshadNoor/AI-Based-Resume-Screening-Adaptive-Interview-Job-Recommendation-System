import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        fileName: {
            type: String,
            required: true
        },

        filePath: {
            type: String,
            required: true
        },

        extractedSkills: [
            {
                type: String
            }
        ],

        resumeScore: {
            type: Number,
            default: 0
        },

        rawText: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Resume = mongoose.model(
    'Resume',
    ResumeSchema
);

export default Resume;