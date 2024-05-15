const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();

const port = process.env.PORT || 3000;
app.use(express.static("public"));

// GET

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.use(bodyParser.urlencoded({extended:true}));

// POST for failure page

app.post("/failure.html", function(req,res){
    res.redirect("/");
});

// POST for signup page

app.post("/", function(req,res){
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const uEmail = req.body.userEmail;
    console.log(fName,lName,uEmail);

    const data = {
        members: [
            {
                email_address: uEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    // Mailchimp npm module

    client.setConfig({
        apiKey: process.env.API_KEY,
        server: process.env.MAIL_CHIMP_SERVER,
    });

    const run = async function(){
        const response = await client.lists.batchListMembers(process.env.MAIL_CHIMP_AUD_ID,jsonData);
        console.log(response);
        if (response.error_count === 0){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    }
    run();
});

app.listen(port,function(){
    console.log(`Server is running on port ${port}`);
});