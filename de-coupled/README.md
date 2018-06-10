# Setup

## Server

* cd into the server folder and `npm install`
* `npm run dev` to start up the express server on port 5000

## Client

* Open a new tab in your terminal CMD+T
* Run `lite-server` to start the client on port 3000

## Note

* Your client side code will make requests against the server at `http://localhost:5000/`
* You will need to install the `dotenv` npm package in the server side to hide your stripe secret
