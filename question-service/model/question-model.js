import mongoose from 'mongoose';
var Schema = mongoose.Schema
let QuestionModelSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    question: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    attempts: {
        type: Array,
        default: []
    }
})


export default mongoose.model('QuestionModel', QuestionModelSchema)




