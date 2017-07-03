const express = require('express')
    , bodyParser = require('body-parser');
var users = require('./users.json');

const app = express();
app.use(bodyParser.json());


// === ENDPOINTS =========================

//Query points
app.get('/api/users', (req, res)=>{
    if (req.query.make) {
        res.status(200).send(users.filter(user => user.make === req.query.make))
    }
    if (req.query.letter) {
        let letter = req.query.letter.toUpperCase();
        res.status(200).send(users.filter(user => user.first_name.charAt(0) === letter))
    }
    res.status(200).send(users);
})
app.get('/api/users/vehicleYear', (req, res) => {
    if (req.query.year) {
        res.status(200).send(users.filter(user => user.year > req.query.year));
    }
    res.status(200).send(users);
})

app.put('/api/user/updateEmail', (req, res) => {
    if (req.query.lastName) {
        users.map(user => {
            if (user.last_name === req.query.lastName) {
                user.email = null;
            }
        });
        res.send(`Thanks for updating ${req.query.lastName}'s email`);
    }
    res.send('Uh, need a lastname');
})
app.put('/api/user/updateVehicle', (req, res) => {
    let userId = false;
    let make = false;
    if (req.query.userId) {
        userId = true;
    }
    if (req.query.make) {
        make = true;
    }
    if (userId && make) {
        users.map(user => {
            if (user.id == req.query.userId) {
                user.make = req.query.make;
            } 
        });
        res.send(`Thanks for updating user #${req.query.userId}'s make`)
    } else if (userId) {
        res.send('Looks like you might be missing a make');
    } else if (make) {
        res.send('Looks like you forgot a user id');
    } else {
        res.send('Looks like you forgot a user id and a make');
    }
})
app.delete('/api/removeUser', (req, res) => {
    if (req.query.model) {
        let newUsers = users.filter(user => user.model !== req.query.model);
        users = newUsers;
        res.send(users)
    }
    res.send('Oops, you need to include a model');
})

//Param points
app.get('/api/user/:id', (req, res) => {
    res.send(users.filter(user => user.id == req.params.id));
});
app.get('/api/vehicles/:model', (req, res) => {
    res.send(users.filter(user => user.model == req.params.model));
});
app.get('/api/userByName/:letter', (req, res) => {
    res.send(users.filter(user => user.first_name.charAt(0) === req.params.letter));
})
app.put('/api/updateName/:id', (req, res) => {
    console.log(req.params.id);
    users.map(user => {
        if (user.id == req.params.id) {
            user.first_name = 'Ned';
        }
    })
    res.send(users);
})



// =======================================

const port = 3000;
app.listen(port, () => console.log('Listening on port: ', port));
