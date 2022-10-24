import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { getAllQuestions,getQuestion,addQuestion, deleteQuestion} from './controller/question-controller.js';

const router = express.Router()


// Controller will contain all the Question-defined Routes
router.get('/ping', (_, res) => res.send('Hello World from question-service'))
router.post('/', addQuestion)
router.post('/delete', deleteQuestion)
router.post('/get', getQuestion)
router.get('/all', getAllQuestions)

app.use('/api/question', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})
app.listen(8003, () => console.log('question-service listening on port 8003'));

// Export our app for testing purposes
export default app;