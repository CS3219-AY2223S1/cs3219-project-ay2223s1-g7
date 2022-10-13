export async function addQuestion(req, res) {
    try {
        const { title, question, difficulty } = req.body;
        if (title && question && difficulty) {
            /*
            const resp = await _createUser(username, password);
            if (resp.err) {
                return res.status(409).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            } 
            */

        } else {
            return res.status(400).json({message: 'Title and/or Question and/or Difficulty are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new question!'})
    }
}


export async function deleteQuestion(req, res) {
    try {
        const { title } = req.body;

        /*
        const deleteResp = await _deleteUser(username);
        if (deleteResp.err) {
            return res.status(409).json({message: 'Unable to delete User'});
        }

        return res.status(200).json({message: `Delete successful`});
            */
    } catch (err) {
       return res.status(500).json({message: 'Database failure when deleting question!'})
    }
}


export async function getQuestion(req, res) {
    try {
        
        if (true) {
            /*
            const resp = await _createUser(username, password);
            if (resp.err) {
                return res.status(409).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            } 
            */

        } else {
            return res.status(400).json({message: 'Title and/or Question and/or Difficulty are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new question!'})
    }
}


export async function getAllQuestions(req, res) {
    try {
        if (true) {
            /*
            const resp = await _createUser(username, password);
            if (resp.err) {
                return res.status(409).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            } 
            */

        } else {
            return res.status(400).json({message: 'Title and/or Question and/or Difficulty are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new question!'})
    }
}
