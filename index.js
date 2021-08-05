const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const OrderItemSchema = new mongoose.Schema({
    product: {type: String, required: true},
    quantity: {type: Number, required: true}
},{
    _id:false
});

const Order = mongoose.model('Order', new mongoose.Schema({
    orderItems: {type: [OrderItemSchema], required: true},
    phone: {type: String, requried: true}
}))


const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/order', (req, res) => {
    new Order(req.body)
        .save()
        .then((order) => {
            res.status(201).send(order)
        })
        .catch(err => res.sendStatus(400))
  })

app.get('/order/:id', (req, res) => {
  Order.findById(req.params.id)
    .then((order) => {
        var o = order.toObject();
        delete o['_id'];
        delete o['__v'];
        order = o;
        res.send(order);
    })
    .catch((err) => res.sendStatus(404));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
