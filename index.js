const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const username=process.env.MONGO_USERNAME;
const password=process.env.MONGO_PASSWORD;
// MongoDB connection

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.4iaupa4.mongodb.net/registrationDB_form`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define registration schema
const registrationSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (CSS, images, etc.)
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const existingUser = await Registration.findOne({ email: email });
    if (!existingUser) {
      const registrationData = new Registration({
        firstname,
        lastname,
        email,
        password,
      });

      await registrationData.save();
      res.redirect("/success");
    } else {
      console.log("User already exists");
      res.redirect("/error");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/public/success.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/public/error.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
