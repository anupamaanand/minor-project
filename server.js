const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse incoming request bodies as JSON
app.use(bodyParser.json());

// Render the home page
app.get("/", (req, res) => {
     res.render("index");
});

// Encrypt the sentence and return it as a response
app.post("/encrypt", (req, res) => {
     const sentence = req.body.sentence;
     const algorithm = "aes-256-cbc";
     const key = crypto.randomBytes(32);
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv(algorithm, key, iv);
     let encrypted = cipher.update(sentence, "utf8", "hex");
     encrypted += cipher.final("hex");
     res.send({ encrypted, key: key.toString("hex"), iv: iv.toString("hex") });
});

// Decrypt the sentence and return it as a response
app.post("/decrypt", (req, res) => {
     const encrypted = req.body.encrypted;
     const key = Buffer.from(req.body.key, "hex");
     const iv = Buffer.from(req.body.iv, "hex");
     const algorithm = "aes-256-cbc";
     const decipher = crypto.createDecipheriv(algorithm, key, iv);
     let decrypted = decipher.update(encrypted, "hex", "utf8");
     decrypted += decipher.final("utf8");
     res.send({ decrypted });
});

// Start the server
const port = 3000;
app.listen(port, () => {
     console.log(`Server listening on port ${port}`);
});
