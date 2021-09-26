const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const user_model = require('./user')
const todo_model = require('./todo')
const list_model = require('./list')
const app = express()
const port = 3001
const jsonParser = bodyParser.json()

mongoose.connect("mongodb://dbUser:1234%21%40%23%24@cluster0-shard-00-00.imioh.mongodb.net:27017,cluster0-shard-00-01.imioh.mongodb.net:27017,cluster0-shard-00-02.imioh.mongodb.net:27017/polyTodo?ssl=true&replicaSet=atlas-xxgrlx-shard-0&authSource=admin&retryWrites=true&w=majority", {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors());

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
    })
)

// user login
app.post('/api/login', jsonParser, (req, res) => {
    user_model.findOne({email: req.body.email}, (err, result) => {
        if (result && result._id)
            res.send(result);
        else
            res.send({userid: -1})
    });
})

// user update
app.post('/api/update/user/:userid', jsonParser, async (req, res) => {
    const {userid} = req.params,
        {firstName, lastName, email, password} = req.body,
        filter = {userid: userid},
        update = {firstName: firstName, lastName: lastName, email: email, password: password};

    await user_model.updateOne(filter, update)
        .then(() => {
            res.send("success")
        })
        .catch(err => console.error(err))
})

// user deactivated account
app.delete("/api/delete/user/:userid", jsonParser, (req, res) => {
    const {userid} = req.params;

    user_model.deleteOne({userid})
        .then(() => {
            res.send('done');
        })
        .catch((err) => console.error(err));
})

// user create
app.post('/api/signup', jsonParser, (req, res) => {
    const {
        firstName, lastName, email, password
    } = req.body;

    user_model.find({}).then((result) => {
        let newUserId = result.length + 1;
        const createdAt = Date.now();
        const newUser = new user_model({
            userid: newUserId, firstName, lastName,
            email, password, createdAt
        })

        if (email === "") {
            res.redirect('/')
        }

        newUser.save()
            .then(() => {
                user_model.find({userid: newUserId},
                    {lean: true},
                    (err, result) => {
                        if (result[0]?._id?.toString().length >= 1) {
                            res.send(JSON.stringify({
                                userid: newUserId,
                                id: result[0]?._id
                            }))
                        }

                        res.status(500).send();
                    })
            })
            .catch(err => console.error(err))
    });
})

// create a task
app.post('/api/add/todo', jsonParser, (req, res) => {
    const {
        todoid, title, description, dueDate, done,
        subtask, parentid, userid,
        lastmodified
    } = req.body;

    const newTodo = new todo_model({
        todoid, title, description, dueDate,
        done, parentid, userid, lastmodified,
        subtask: {
            subtaskId: 1, title: subtask.title,
            description: subtask.description,
            done: subtask.done ?? false
        }
    });

    if (description === "") {
        res.status(400).send('Bad request');
    }

    newTodo.save()
        .then(() => {
            res.send(JSON.stringify(todoid))
        })
        .catch(err => console.error(err))
})

// read one task based on task id 
app.post("/api/readone/todo/:todoid", jsonParser, async (request, response) => {
    const info = todo_model.findOne({todoid: request.params.todoid});

    try {
        response.send(info);
    } catch (error) {
        response.status(500).send(error);
    }
});

// delete a task 
app.delete("/api/delete/todo/:todoid/:userid", jsonParser, (req, res) => {
    const {todoid, userid} = req.params;

    todo_model.deleteOne({todoid: todoid, userid: userid})
        .then(() => {
            res.send('success');
        })
        .catch((err) => console.error(err));
})

// read tasks of the user that is logged in
app.get("/api/read/todo/:userid", async (req, res) => {
    const {userid} = req.params;
    const todos = await todo_model.find({userid: userid});

    try {
        res.send(todos);
    } catch (error) {
        res.status(500)
            .send(error);
    }
});

// update a task
app.post("/api/update/todo/:todoid", jsonParser, async (req, res) => {
    const {todoid} = req.params,
        {title, description, done, subtask} = req.body,
        filter = {todoid: todoid},
        update = {
            title: title, description: description, done: done, subtask: {
                subtaskId: 1, title: subtask.title, description: subtask.description,
                done: subtask.done ?? false
            }
        };

    await todo_model.updateOne(filter, update)
    res.send("success")
});

// add a list
app.post('/api/add/list', jsonParser, (req, res) => {

    const {
        listId, title, description, todoid, userid,
        lastmodified
    } = req.body;

    const newList = new list_model({
        listId, title, description, todoid, userid, lastmodified
    })

    if (description === "") {
        res.redirect('/')
    }

    newList.save()
        .then(() => {
            res.send(JSON.stringify(listId))
            res.redirect('/')
        })
        .catch(err => console.error(err))
})

// update a list
app.post('/api/update/list/:listId', jsonParser, async (req, res) => {
    const {listId} = req.params,
        {title, description, todoid, userid} = req.body,
        filter = {listId: listId, userid: userid},
        update = {title: title, description: description, lastmodified: Date.now, todoid: todoid};

    await list_model.updateOne(filter, update)
        .then(() => {
            res.send("success")
        })
        .catch(err => console.error(err))
})

// delete a list
app.delete("/api/delete/list/:listId/:userid", jsonParser, (req, res) => {
    const {listId, userid} = req.params;

    list_model.deleteOne({listId: listId, userid: userid})
        .then(() => {
            res.send('done');
        })
        .catch((err) => console.error(err));
});

// read lists of user that is logged in
app.get("/api/read/list/:userid", async (req, res) => {
    const {userid} = req.params;
    const lists = await list_model.find({userid: userid});

    try {
        res.send(lists);
    } catch (error) {
        res.status(500)
            .send(error);
    }
});

// read one list based on id
app.post("/api/readone/list/:listId", jsonParser, async (request, response) => {
    const info = list_model.findOne({listId: request.params.listId});

    try {
        response.send(info);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})