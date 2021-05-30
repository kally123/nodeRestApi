const serverless = require('serverless-http');
const express = require('express');
const app = express();
const Joi = require('joi');
app.use(express.json());

const arcs = [
    {arcName: 'ABTEK ELECTRONICS AND CELLPHONE REPAIR SHOP', pincode: 4500},
    {arcName: 'CELL ACTIVE - Greenhills', pincode: 1504}
];

const lsps = [
    {lspName: 'ACER', pincode: 4102},
    {lspName: 'ALCATEL', pincode: 4102}
];


app.get('/', function (req, res) {
  res.send('Hello Kalyan!')
})

app.get('/hello', (request, response) => {
    response.status(200).send(
    {
        'message':'Hello Kally!'
    })
})

app.get('/fetch/arcs', (req,res) => {
    res.send(arcs);
})

app.get('/fetch/lsps', (req,res) => {
    res.send(lsps);
})

app.get('/fetch/arcs/:pincode' , (req,res) => {
    let arc = arcs.find(a => a.pincode == parseInt(req.params.pincode));
    if(!arc) {
        return res.status(404).send('Arc not available for the search criteria!')
    }
    res.status(200).send(arc);
})

app.get('/fetch/lsps/:pincode' , (req,res) => {
    let lsp = lsps.find(a => a.pincode == parseInt(req.params.pincode));
    if(!lsp) {
        return res.status(404).send('Lsp not available for the search criteria!')
    }
    res.status(200).send(lsp);
})

app.get('/fetch/arcs/:arcName' , (req,res) => {
    let arc = arcs.find(a => a.arcName === req.params.arcName);
    if(!arc) {
        return res.status(404).send('Arc not available for the search criteria!')
    }
    res.status(200).send(arc);
})

app.get('/fetch/lsps/:lspName' , (req,res) => {
    let lsp = lsps.find(a => a.lspName === req.params.lspName);
    if(!lsp) {
        return res.status(404).send('Lsp not available for the search criteria!')
    }
    res.status(200).send(lsp);
})

app.post('/fetch/arcs', (req,res) => {
    const result = validateArc(req.body);
    if(result.error){
        return res.status(400).send(result.error);
    }

    let arc = {
        arcName : req.body.arcName,
        pincode : req.body.pincode
    }
    arcs.push(arc);
    res.send(arc);
})

app.delete('/fetch/arcs/:pincode', (req,res) => {
    let arc = arcs.find(a => a.pincode == parseInt(req.params.pincode));
    if(!arc) {
        return res.status(404).send('Arc not available for the search criteria!')
    }

    const index = arcs.indexOf(arc);

    arcs.splice(index, 1)
    res.send(arc);
})

app.put('/fetch/arcs/:pincode' , (req,res) => {
    let arc = arcs.find(a => a.pincode == parseInt(req.params.pincode));
    if(!arc) {
        return res.status(404).send('Arc not available for the search criteria!')
    }

    const { error } = validateArc(req.body);
    if(error){
        res.status(400).send(error);
        return;
    }

    arc.arcName = req.body.arcName;

    res.status(200).send(arc);
})

function validateArc(arc){
    const schema = {
        arcName : Joi.string().min(3).required()
    };
    return Joi.validate(arc , schema);
}

module.exports.handler = serverless(app);