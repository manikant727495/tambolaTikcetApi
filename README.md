# tambolaTikcetApi
how to run this project

steps:
clone this repository in local

install node packages using npm install

setup mongodb

run the command "node app.js"

How use each rest api


Authentication API

create User:

request url: POST /api/auth/createuser

request body
{

  "name": "",
  
  "email": "",
  
  "password": ""
  
}


Login:

request url: POST /api/auth/login

request body
{

  "email": "",
  
  "password": ""
  
}



get user details

request url: POST /api/auth/getuser

headers
{

  "auth-token": ""
  
}




TICKET API


how to call api 

create ticket

request url: POST /api/ticket/createticket

request body:

{

  "numberoftickets" : {number}
  
}

example

http://localhost:4000/api/ticket/createticket

{

  "numberoftickets": 20
  
}

get Ticket:

request Url: GET /gettickets/{id}?page={page_number}&pageSize={page_size}


example: http://localhost:4000/api/ticket/gettickets/1d8b584c-ab76-4053-be91-e4c7e8b9b751?page=1&pageSize=3

