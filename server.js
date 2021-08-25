require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const AuthRouter = require('./routes/auth')
const ListRouter = require('./routes/lists')

const server = express();

server.use(cors({credentials : true, origin : '*'}));
server.use(bodyParser.urlencoded({extended : false}));
server.use(bodyParser.json());

server.use('/auth', AuthRouter);
server.use('/lists', ListRouter);

server.get('/' , (req, res) =>
{
    res.send('Welcome to Ranker backend api');
})
server.listen(process.env.PORT , () => console.log('Server running on PORT ' + process.env.PORT));