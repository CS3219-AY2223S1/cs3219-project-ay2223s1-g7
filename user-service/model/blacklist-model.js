import mongoose from 'mongoose';
var Schema = mongoose.Schema
let BlackListSchema = new Schema({
    jwt_token: {
        type: String,
        required: true,
        unique: true,
    },
    createdDate: {
        type: Date
        // expireAfterSeconds: 15000, 
        // default: Date.now,
        // required: true,
    }
})

BlackListSchema.path('createdDate').index({ expires: 3600 }); // 1h

export default mongoose.model('BlackListModel', BlackListSchema)