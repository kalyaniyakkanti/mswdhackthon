const express = require("express");
const router = express.Router();

const Booking = require("../models/booking")
const moment = require("moment")
const Room = require("../models/room")
const { v4: uuidv4 } = require('uuid');
const stripe=require('stripe')('sk_test_51P9rpjSAoqTqfXeKgDn3N6o1zqUUkbJhByMaTqynjfv7OU7NYgDyb5YaKzl7cv47DhNjpMo9tGOfgr6Bsu3EIy1l003sOHrDwO')

router.post("/bookroom", async (req, res) => {
    const { room,userid,fromdate,todate,totalamount,totaldays,token } = req.body;

    try {
        const customer= await stripe.customers.create({
           email:token.email,
           source:token.id

        })

        const payment=await stripe.charges.create(
            {
                amount:totalamount*100,
                customer:customer.id,
                currency:'inr',
                receipt_email:token.email




            },{
                idempotencykey:uuidv4()

            })
            if (payment){

                
                    const newbooking = new Booking({
                        room: room.name,
                        roomid: room._id,
                        userid,
                        fromdate: moment(fromdate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                        todate: moment(todate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                        totaldays,
                        totalamount,
                        transactionId: '1234'
                    });
                    
                    const booking = await newbooking.save()
            
                    const roomtemp = await Room.findOne({ _id: room._id })
                    roomtemp.currentbookings.push({bookingid: booking._id, 
                        fromdate: moment(fromdate).format('DD-MM-YYYY'), 
                        todate: moment(todate).format('DD-MM-YYYY'),
                        userid:userid,
                        status:booking.status});
                    await roomtemp.save()
                    
            
                } 
            
            res.send('payment successful,You room is booked')
        
    } catch (error) {
        return res.status(400).json({error})
        
    }

});
module.exports = router