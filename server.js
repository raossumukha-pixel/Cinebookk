
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req,res)=>{
    res.send("CineBook Backend Running");
});

// MySQL Connection
const mysql = require("mysql2");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"kyliejenner1013!",
    database:"cinebook"
});

db.connect((err)=>{
    if(err){
        console.log("Database connection failed");
        console.log(err);
    }
    else{
        console.log("MySQL Connected");
    }
});


// Booking Route
app.post("/book",(req,res)=>{

const {
movie_name,
seat_number,
mobile_number,
payment_method,
show_date,
show_time,
total_payment

}=req.body;


console.log(req.body);


const sql=`

INSERT INTO bookings
(movie_name,seat_number,mobile_number,
payment_method,show_date,show_time,total_payment)

VALUES (?,?,?,?,?,?,?)

`;

db.query(

sql,

[
movie_name,
seat_number,
mobile_number,
payment_method,
show_date,
show_time,
total_payment
],

(err,result)=>{

if(err){

console.log(err);

return res.send("Booking Failed");

}

res.send("Booking Success");

}

);

});


// Start Server
app.listen(5000,()=>{
    console.log("Server running on port 5000");
});

