let trailerLink = "";
let currentMovie = " ";
let bookedSeats = [];

function openMovie(title, genre, poster, trailer){
    document.getElementById("moviePage").style.display = "block";
    document.getElementById("movieTitle").innerText = title;
    document.getElementById("movieGenre").innerText = genre;
    document.getElementById("moviePoster").src = poster;
    document.getElementById("moviePage").style.backgroundImage =
    `url(${poster})`;

   trailerLink = trailer;

currentMovie = title;

bookedSeats =
JSON.parse(localStorage.getItem(currentMovie)) || [];

document.querySelectorAll(".seat").forEach(seat => {

    seat.classList.remove("booked");
    seat.classList.remove("selected");

    if(bookedSeats.includes(seat.innerText)){
        seat.classList.add("booked");
    }

});

window.scrollTo({
    top: document.getElementById("moviePage").offsetTop,
    behavior: "smooth"
});
}

function playTrailer(){
    document.getElementById("trailer-box").innerHTML = `
    <iframe width="700" height="400"
    src="${trailerLink}"
    frameborder="0"
    allowfullscreen>
    </iframe>
    `;
}

function openSeats(){
    document.getElementById("seatPage").style.display = "block";
    window.scrollTo({
        top: document.getElementById("seatPage").offsetTop,
        behavior: "smooth"
    });
}

/* SEAT SELECTION */


let seats=document.querySelectorAll(".seat");

seats.forEach(seat=>{

    // load booked seats automatically
    if(bookedSeats.includes(seat.innerText)){
        seat.classList.add("booked");
    }

    seat.addEventListener("click",()=>{

        if(seat.classList.contains("booked")){
            return;
        }

        seat.classList.toggle("selected");

    });

});

function confirmBooking(){
console.log("Step 1");
    if(!paymentStatus){
alert("Please complete payment first");
return;
}

let selectedSeats=document.querySelectorAll(".selected");
if(selectedSeats.length===0){
alert("Please select seats first");
return;
}

const movie_name =
document.getElementById("movieTitle").innerText;
const seat_number =
Array.from(selectedSeats)
.map(seat=>seat.innerText)
.join(",");

const mobile_number=
prompt("Enter mobile number");

const paymentMethod=
document.getElementById("paymentMethod").value;

if(paymentMethod===""){
alert("Please select payment method");
return;
}

fetch("http://localhost:5000/book",{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

movie_name,
seat_number,
mobile_number,
payment_method: paymentMethod,

show_date: document.getElementById("showDate").value,

show_time: document.getElementById("showTime").value,

total_payment: selectedSeats.length * 250

})

})

.then(res => res.text())

.then(data => {

    console.log(data);

    if(data !== "Booking Success"){
        alert("Booking Failed");
        return;
    }

    let ticketNo = "CB" + Math.floor(Math.random()*100000);

    let selectedTime =
    document.getElementById("showTime").value;

    generateTicket(
        movie_name,
        seat_number,
        mobile_number,
        selectedTime
    );

    selectedSeats.forEach(seat=>{

        bookedSeats.push(seat.innerText);

        seat.classList.remove("selected");

        seat.classList.add("booked");

    });

    localStorage.setItem(
        currentMovie,
        JSON.stringify(bookedSeats)
    );

    alert(
        "Booking Successful\n\n"+
        "Ticket No : "+ticketNo
    );

})

.catch(err=>{
console.log(err);
});

}

function openLogin(){
document.getElementById("loginBox").style.display="block";
}
function closeLogin(){
document.getElementById("loginBox").style.display="none";
}
function loginUser(){
let email=
document.getElementById("email").value;
if(email===""){
alert("Enter details");
return;
}
alert("Logged in Successfully ✅");
document.querySelector(".signin-btn")
.innerHTML="👤 Profile";
closeLogin();
}
let paymentStatus=false;
document
.getElementById("paymentMethod")
.addEventListener("change",function(){

if(this.value==="UPI"){
document.getElementById("upiBox")
.style.display="block";
}
else{
document.getElementById("upiBox")
.style.display="none";
paymentStatus=false;
}
});

function paymentDone(){
paymentStatus=true;
alert("Payment Successful ✅");
}

function generateTicket(movie,seat,phone,showTime){
console.log("PDF Started");
const {jsPDF}=window.jspdf;
const doc=new jsPDF();

let today=new Date();

let date=today.toLocaleDateString();

let day=today.toLocaleDateString(
"en-US",
{weekday:"long"}
);

let total=seat.split(",").length*250;

let ticketID=
"CB"+Math.floor(Math.random()*100000);


// Background ticket card
doc.setFillColor(245,245,245);
doc.roundedRect(
20,
20,
170,
230,
5,
5,
"F"
);


// Header
doc.setFont("helvetica","bold");
doc.setFontSize(22);

doc.text(
"CineBook",
75,
35
);

doc.setFontSize(10);

doc.setTextColor(100);

doc.text(
"Your Movie Ticket",
82,
42
);


// Poster box
let poster=document.getElementById("moviePoster");

if(poster){

doc.addImage(
poster,
"JPEG",
30,
55,
40,
55
);

}

// Details section
doc.setTextColor(0);

doc.setFontSize(16);
doc.setFont("helvetica","bold");

doc.text(movie,85,65);


doc.setFontSize(11);
doc.setFont("helvetica","normal");


doc.text(
date+" | "+day,
85,
80
);

doc.text(
"Show: "+showTime,
85,
92
);

doc.text(
"Seats: "+seat,
85,
104
);

doc.text(
"Phone: "+phone,
85,
116
);


// Divider line
doc.setDrawColor(180);

doc.line(
30,
130,
180,
130
);


// QR box
doc.roundedRect(
35,
145,
45,
45,
2,
2
);

doc.setFontSize(10);

doc.text(
"QR CODE",
44,
170
);


// Ticket info right
doc.setFontSize(12);

doc.text(
"Ticket ID",
100,
155
);

doc.setFont(
"helvetica",
"bold"
);

doc.text(
ticketID,
100,
165
);


doc.setFont(
"helvetica",
"normal"
);

doc.text(
"Total Amount",
100,
185
);

doc.setFont(
"helvetica",
"bold"
);

doc.setFontSize(18);

doc.text(
"₹"+total,
100,
198
);


// Footer
doc.setFillColor(
30,
30,
30
);

doc.rect(
20,
230,
170,
20,
"F"
);

doc.setTextColor(
255
);

doc.setFontSize(
10
);

doc.text(
"Enjoy your movie with CineBook 🎬",
55,
242
);
console.log("Saving PDF....");
doc.save(
"CineBook_Ticket.pdf"
);

}