const express = require('express');
const router = express.Router();
const ticket = require('../models/tambolaTicket');
const { v4: uuidv4 } = require('uuid');

router.post('/createticket',async(req,res,next) =>{   
    const numberOfTickets = req.body.numberoftickets;
    const tambolatickets = {
        id: uuidv4(),
        tickets: []
    }

    if (!numberOfTickets || isNaN(numberOfTickets) || numberOfTickets <= 0) {
      return res.status(400).json({ error: 'Invalid number of tickets' });
    }
  
    for (let index = 0; index < numberOfTickets; index++) {
      const ticket = generateTambolaTicket();
      tambolatickets.tickets.push(ticket);
    }
    let unique = false;
    while (!unique) {
      const existingTicket = await ticket.findOne({ id: tambolatickets.id });
      if (existingTicket) {
        tambolatickets.id = uuidv4();
      } else {
        unique = true;
      }
    }
    try{
        const createticket = await ticket.create(tambolatickets);
        ticketId = tambolatickets.id;
        return res.status(201).json({ ticketId});
    } catch(error){
        console.log(error.message);
        res.status(500).send('some error occured');
    }
})

router.get('/gettickets/:id',async(req,res,next) =>{
  //get page number and page size from request query if not set Default value
  const page = parseInt(req.query.page) || 1; 
  const pageSize = parseInt(req.query.pageSize) || 10; 
    try{
      const tambolatickets = await ticket.findOne({ id: req.params.id });
      if (tambolatickets) {
        const tickets = tambolatickets.tickets;
  
        // Calculate pagination parameters
        const totalNumberOfTickets = tickets.length;
        const totalPages = Math.ceil(totalNumberOfTickets / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
  
        // Get the tickets for the requested page
        const pagedTickets = tickets.slice(startIndex, endIndex);
  
        res.status(200).json({
          totalPages,
          currentPage: page,
          pageSize,
          totalNumberOfTickets,
          tickets: pagedTickets
        });
      } else {
        res.status(400).json({ error: 'Ticket ID does not exist' });
      }
  
    } catch(error){
        console.log(error.message);
        res.status(500).send('some error occured'); 
    }
})

function generateTambolaTicket() {
    
    let numbers = [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ]

    const minValue = 1;
    const maxValue = 90;

    for(let index = 0; index< 3; index++){
        let count = 0;
        while(count < 5){
            const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
            const column = Math.floor((randomNumber - 1) / 10);
            if (!numbers.flat().includes(randomNumber) && numbers[index][column] == 0) {
                    numbers[index][column] = randomNumber;
                    count++;
            }
        }
    }

    for (let col = 0; col < 9; col++) {
        const columnNumbers = [];
        for (let row = 0; row < 3; row++) {
            if(numbers[row][col] != 0){
                columnNumbers.push(numbers[row][col]);
            }
        }
    
        columnNumbers.sort();

        let i = 0;
        for (let row = 0; row < 3; row++) {
          if (numbers[row][col] !== 0) {
            numbers[row][col] = columnNumbers[i];
            i++;
          }
        }
      }
    return numbers;
  }

module.exports = router;