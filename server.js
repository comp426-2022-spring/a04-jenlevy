//express
const express = require('express')
const { count } = require('yargs')
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//morgan
const morgan = require("morgan")

/*/ Use morgan for logging, use the command npx nodemon server.js

app.use(morgan('tiny'))
app.use(morgan('combined'))
app.use(morgan('common'))
app.use(morgan('short'))
app.use(morgan('dev'))

/*/

/*/example from class

app.use(fs.writeFile('./access.log', data,
{flag: 'a'}, (err, req, res, next) => {
    if(err){
        console.error(err)
    } else {
        console.log()
    }
}
)

)

/*/

const fs = require('fs')
const db = require('./database.js')

// Store help text 
const help = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)

const args = require('minimist')(process.argv.slice(2))
args["port"]
var port = args.port || 5000 || process.env.PORT

if (args.help){
    console.log(help)
}

// one random coin flip
function coinFlip() {
    let flip = Math.random()
    var result = ""
    if (flip > 0.5){
      result = "heads"
    } else {
      result = "tails"
    }
    return result
}

//many random coin flips
function coinFlips(flips) {
    var flipArray = new Array(flips)

    for(var i = 0; i<flips; i++){
    var flip = Math.random()
    if (flip<0.5){
        flipArray[i] = "heads"
    } else {
        flipArray[i] = "tails"
    }
}
return flipArray

}

// flip a coin with a call to see if it matches the call
function flipACoin(call) {

    var result = ""
    var flip = ""
    var num = Math.random()
        
    if (num < 0.5){
        flip = "heads"
    } else {
        flip = "tails"
    }
        
    if (flip == call){
        result = "win"
    } else {
        result = "lose"
    }
        
    return {"call": call, "flip": flip, "result": result}
}

// an array that tallies the random coin flips
function countFlips(array) {
    
    var heads = 0
    var tails = 0
            
    for (var i = 0; i<array.length; i++){
        if (array[i] == "heads"){
            heads += 1
        } else{
            tails += 1
        }
    }
    return {"heads" : heads, "tails": tails}
}

const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

//default check endpoint
app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
    });

//flip endpoint (one flip)
app.get('/app/flip', (req, res) => {
    
    const result = coinFlip()
    res.status(200).json({"flip": result})

    });

//flips endpoint (many flips)
app.get('/app/flips/:number', (req, res) => {
    
    const results = coinFlips(req.params.number)
    const summary = countFlips(results)
    res.status(200).json({"raw": results, "summary": summary})

    });

//flip while calling heads endpoing
app.get('/app/flip/call/heads', (req, res) => {
    var resStatusCode = 200

    res.status(200).json(flipACoin("heads"))
    });

//flip while calling tails endpoint
app.get('/app/flip/call/tails', (req, res) => {
    var resStatusCode = 200

    res.status(200).json(flipACoin("tails"))
    });

// READ (HTTP method GET) at root endpoint /app/
app.get("/app/", (req, res, next) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});

// Define other CRUD API endpoints using express.js and better-sqlite3
// CREATE a new user (HTTP method POST) at endpoint /app/new/
app.post("/app/new/user", (req, res, next) => {
    let data = {
        user: req.body.username,
        pass: req.body.password
    }
    const stmt = db.prepare('INSERT INTO userinfo (username, password) VALUES (?, ?)')
    const info = stmt.run(data.user, data.pass)
    res.status(200).json(info)
});
// READ a list of users (HTTP method GET) at endpoint /app/users/
app.get("/app/users", (req, res) => {	
    try {
        const stmt = db.prepare('SELECT * FROM userinfo').all()
        res.status(200).json(stmt)
    } catch {
        console.error(e)
    }
});

// READ a single user (HTTP method GET) at endpoint /app/user/:id
app.get("/app/user/:id", (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM userinfo WHERE id = ?').get(req.params.id);
        res.status(200).json(stmt)
    } catch (e) {
        console.error(e)
    }

});

// UPDATE a single user (HTTP method PATCH) at endpoint /app/update/user/:id
app.patch("/app/update/user/:id", (req, res) => {
    let data = {
        user: req.body.username,
        pass: req.body.password
    }
    const stmt = db.prepare('UPDATE userinfo SET username = COALESCE(?,username), password = COALESCE(?,password) WHERE id = ?')
    const info = stmt.run(data.user, data.pass, req.params.id)
    res.status(200).json(info)
});

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {
    const stmt = db.prepare('DELETE FROM userinfo WHERE id = ?')
    const info = stmt.run(req.params.id)
    res.status(200).json(info)
});

//default error message
app.use(function(req,res){
    res.status(404).send("Error test successful.")
    res.type("text/plain")
}
)

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server stopped')
    })
})
