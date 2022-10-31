import {createQuestion, checkQuestionInDatabase, findQuestionByTitle, findQuestionByDifficulty, findAllQuestionByDifficulty,deleteQuestion, findAllQuestionAttempted} from './repository.js';

export async function ormCreateQuestion(title, question, difficulty) {

    try {
        const isInDb = await checkQuestionInDatabase(title) 
        if (isInDb ) {
            throw new Error("Duplicate Question")
        }
        const newQuestion = await createQuestion({title, question, difficulty});
        newQuestion.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new question');
        return { err };
    }
}

export async function ormSearchQuestionByTitle(title) {
    try {
        const question = await findQuestionByTitle(title) 
        console.log("Question: ", question)
        if (question) {
            return question;
        } else {
            throw new Error("Missing question")
        }
     
    } catch (err) {
        console.log('ERROR: Could not find question');
        return { err };
    }
}


export async function ormSearchQuestionByDifficulty(difficulty, userOne, userTwo) {
    try {
        const question = await findQuestionByDifficulty(difficulty, userOne, userTwo) 
        console.log("Question: ", question)
        if (question) {
            return question;
        } else {
            throw new Error("Missing question")
        }
     
    } catch (err) {
        console.log('ERROR: Could not find question');
        return { err };
    }
}

export async function ormSearchAllQuestionsByDifficulty(difficulty) {
    try {
        const questions = await findAllQuestionByDifficulty(difficulty) 
        console.log("Question: ", questions)
        if (questions) {
            return questions;
        } else {
            throw new Error("Missing question")
        }
     
    } catch (err) {
        console.log('ERROR: Could not find question');
        return { err };
    }
}



export async function ormDeleteQuestion(title) {

    try {
        const question = await deleteQuestion(title) 
        if (question) {
            return true;
        } else {
            throw new Error("Invalid deletion")
        }        
    } catch (err) {
        console.log('ERROR: Could not delete');
        return { err };
    }
}

export async function ormSearchAllQuestionsAttempted(user) {
    try {
        const questions = await findAllQuestionAttempted(user) 
        console.log("Question: ", questions)
        if (questions) {
            return questions;
        } else {
            throw new Error("Missing question")
        }
     
    } catch (err) {
        console.log('ERROR: Could not find question');
        return { err };
    }

}