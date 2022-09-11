import mongoose from 'mongoose';
var Schema = mongoose.Schema
let PendingMatchModelSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    createdAt: { 
        type: Date,
        expires: '30',
        default: Date.now
    }
})

export default mongoose.model('PendingMatchModel', PendingMatchModelSchema)
