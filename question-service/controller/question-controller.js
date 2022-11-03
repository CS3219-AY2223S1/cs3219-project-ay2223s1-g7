import {
    ormCreateQuestion as _createQuestion, ormSearchAllQuestionsByDifficulty as _searchAllQuestionsByDifficulty,
    ormSearchQuestionByDifficulty as _searchQuestionByDifficulty, ormDeleteQuestion as _deleteQuestion, ormSearchQuestionByTitle as _searchQuestionByTitle, 
    ormSearchAllQuestionsAttempted as _searchAllQuestionsAttempted, ormAttemptQuestion as _attemptQuestion
} from '../model/question-orm.js'
import redis from "redis"

const REDIS_HOST = process.env.ENV == "PROD" ? { url: process.env.REDIS_HOST } : '';
const redisClient = redis.createClient(REDIS_HOST)
if (!redisClient) {
    console.log("cannot connect to redis");
} else {
    console.log("connected to redis");
}

export async function addQuestion(req, res) {
    try {
        const { title, question, difficulty } = req.body;
        if (title && question && difficulty) {
            const resp = await _createQuestion(title, question, difficulty)

            if (resp.err) {
                return res.status(409).json({ message: 'Could not create a new question!' });
            } else {
                console.log(`Created new question ${title} successfully!`)
                return res.status(201).json({ message: `Created new question ${title} successfully!` });
            }
        } else {
            return res.status(400).json({ message: 'Title and/or Question and/or Difficulty are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when creating new question!' })
    }
}


export async function deleteQuestion(req, res) {
    try {
        const { title } = req.body;
        const deleteResp = await _deleteQuestion(title);
        if (deleteResp.err) {
            return res.status(409).json({ message: 'Unable to delete question' });
        }

        return res.status(200).json({ message: `Delete successful` });

    } catch (err) {
        return res.status(500).json({ message: 'Database failure when deleting question!' })
    }
}


export async function getQuestion(req, res) {
    try {

        const { difficulty, userOne, userTwo } = req.body
        console.log("DIFFICULTY IS: " + difficulty)
        const resp = await _searchQuestionByDifficulty(difficulty, userOne, userTwo);
        if (resp.err) {
            return res.status(409).json({ message: 'Could not find question!' });
        } else {
            return res.status(201).json({ question: resp });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Database failure when finding question!' })
    }
}


export async function getAllQuestions(req, res) {
    try {

        const { difficulty } = req.body
        const resp = await _searchAllQuestionsByDifficulty(difficulty);
        console.log(resp)
        if (resp.err) {
            return res.status(409).json({ message: 'Could not find question!' });
        } else {
            return res.status(201).json({ question: resp });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Database failure when finding question!' })
    }
}


export async function getAllQuestionsAttempted(req, res) {
    try {
        const { user } = req.body

        redisClient.get(`questions-${user}`, async (error, questions) => {
            if (error) console.error(error);
            if (questions != null) {
                console.log("Hit")
                return res.status(201).json({ question: JSON.parse(questions) });
            } else {
                console.log("Miss")
                const resp = await _searchAllQuestionsAttempted(user);
                console.log(resp)
                if (resp.err) {
                    return res.status(409).json({ message: 'Could not find question!' });
                } else {
                    redisClient.setex(
                        `questions-${user}`,
                        1000,
                        JSON.stringify(resp)
                    )
                    return res.status(201).json({ question: resp });
                }
            }
        })

    } catch (err) {
        return res.status(500).json({ message: 'Database failure when finding question!' })
    }

}

export async function attemptQuestion(req, res) {
    try {
        const { title, user } = req.body
        const resp = await _attemptQuestion(title, user);
        console.log(resp)
        if (resp.err) {
            return res.status(409).json({ message: 'Could not find question!' });
        } else {
            redisClient.del(`questions-${user}`)
            return res.status(201).json({ question: resp });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Database failure when finding question!' })
    }

}



