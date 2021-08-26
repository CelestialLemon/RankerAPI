const express = require('express')
const router = express.Router();

const ListModel = require('../models/list.model')

const jwt = require('jsonwebtoken');
const listModel = require('../models/list.model');

const authenticateToken = (req, res, next) =>
{
    if(req.headers && req.headers['authorization'])
    {
        const token = req.headers['authorization'].split(' ')[1];
       
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>
        {
            if(err)
            {
                //invalid token
                res.status(401).send({'msg' : 'Invalid Token'})
                return;
            }
            //token valid
            req.user = {};
            req.user.username = user.username;

            next();
        }
        )
    }
    else
    {
        //token wasn't sent
        res.status(401).send({'msg' : 'Un-authorized'});
        return;
    }
}

router.post('/create', authenticateToken, (req,res) =>
{
    console.log(req.user);
    console.log(req.body);

    const newList = ListModel({
        'creator' : req.user.username,
        'listName' : req.body.listName,
        'canShare' : req.body.canShare,
        'items' : req.body.items
    });

    newList.save();
    res.send({msg : "list added successfully"});
})

router.get('/:id', authenticateToken, async (req, res) =>
{
    const list = await ListModel.findById(req.params.id);
    if(list.canShare || list.creator == req.user.username)
    res.send(list);
    else
    res.send({'msg' : 'not your list'});
})

router.get('/', authenticateToken, async (req, res) =>
{
    const lists = await ListModel.find({'creator' : req.user.username});
    res.send(lists);
})

router.post('/deletelist', authenticateToken, async (req, res) =>
{
    const deletedList = await ListModel.findByIdAndDelete(req.body._id)
    console.log('deleting list');
    console.log(deletedList);
    res.send({msg : 'deleted'});
})

router.put('/:id', authenticateToken, async (req, res) =>
{
    const list = await listModel.findById(req.params.id);
    if(list.creator == req.user.username)
    {
        const updatedList = await ListModel.findByIdAndUpdate(req.params.id, req.body, {useFindAndModify : false});
        console.log(updatedList.id + ' list updated');
        res.send({'msg' : 'updated'});
    }
    else
    {
        res.status(401).send({'msg' : 'not your list'})
    }
})

module.exports = router;