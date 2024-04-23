const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // Import mongoose for MongoDB integration


// Import fetch
import("node-fetch").then(fetchModule => {
    const fetch = fetchModule.default;
}).catch(err => {
    console.error("Error:", err);
});

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/weatherApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if unable to connect
});

// Define a schema for search history
const searchSchema = new mongoose.Schema({
    location: String,
    temperature: Number,
    description: String,
    iconUrl: String,
    searchedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model based on the schema
const Search = mongoose.model("Search", searchSchema);

app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/",(req,res)=>{
    // res.sendFile(__dirname+"/index.html");
    const sendData= {location: "Location", temp:"Temp",disc:"description" ,feel: "feel-like",humidity:"humidity",speed:"speed"};
    res.render("index",{sendData: sendData});
});
app.post("/", async (req, res) => {
    try {
        let location = await req.body.city;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
        const response = await fetch(url);
        const weatherData = await response.json();
        const temp = Math.floor(weatherData.main.temp);
        const disc = weatherData.weather[0].description;
        
        // Save search history to MongoDB
        const search = new Search({
            location: location,
            temperature: temp,
            description: disc,
            searchedAt: new Date() // Add the current timestamp for search time
        });
        await search.save(); // Save the search data to MongoDB

        const sendData = {
            temp: temp,
            disc: disc,
            location: location,
            feel: weatherData.main.feel_like,
            humidity: weatherData.main.humidity,
            speed: weatherData.wind.speed
        };
        res.render('index', { sendData: sendData });
    } catch (error) {
        console.error("Error while processing request:", error);
        res.status(500).send("Internal Server Error");
    }
});



// Add route to fetch search history from MongoDB
app.get("/search-history", async (req, res) => {
    try {
        const searchHistory = await Search.find().sort({ searchedAt: -1 }).limit(5); // Fetch latest 5 search history items
        res.json(searchHistory);
    } catch (err) {
        console.error("Error fetching search history:", err);
        res.status(500).json({ message: "Error fetching search history" });
    }
});


app.listen(3000, () => {
    console.log("server is running");
});

