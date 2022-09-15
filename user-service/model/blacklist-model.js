import mongoose from 'mongoose';
var Schema = mongoose.Schema
let BlackListSchema = new Schema({
    jwt_token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        expires: 600, 
        required: true,
    }
})
export default mongoose.model('BlackListModel', BlackListSchema)