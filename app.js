const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const LINE_CHANNEL_ACCESS_TOKEN = `uLSZ0CJ6NiARdRM2bGkHO4plWifMgtNMIN1dDh5I0QwZqrLmJCg6T2tsNphbM3QDmdpK2hrJRrdW5oq3tE9wmHEdBkFfJL53uVQYBMFxCo3zU1OsJ2nUDQz6eb/atH8Ods8iRDjzjnt21LpMTz4vQAdB04t89/1O/w1cDnyilFU=`;  // Set your actual access token here

app.use((req, res, next) => {
    // Extract host and protocol (http or https) from the request
    const protocol = req.protocol;
    const host = req.headers.host;
    const fullUrl = `${protocol}://${host}`;
    
    console.log("Current Host and Port:", fullUrl); // Log current host and port
    req.currentHost = fullUrl; // Attach it to request if needed later
  
    next();
  });

app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, "uploads")));
app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/index.html')
})


// Ensure the upload directory exists or create it
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from the "upload" directory
app.use("/uploads", express.static(uploadDir));

// Configure multer to store files in the "uploads" directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Set a unique file name
  },
});
const upload = multer({ storage: storage });

// Endpoint to upload an image
app.post("/send-image", (req, res) => {

      upload.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload error", error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }
  // Construct the URL to access the uploaded image
  const imageUrl = `${req.currentHost}/uploads/${req.file.filename}`;
  res.json({
    message: "Image uploaded successfully!",
    imageUrl: imageUrl,
  });
  console.log(imageUrl)

  try {
           
    const lineMessage = {
        to: "U9422e4a072f0ccf595537299bf39a769",
        messages: [
            {
                type: "flex",
                altText: "Payment Slip Received",
                contents: {
                    type: "bubble",
                    hero: {
                        type: "image",
                        url: imageUrl,
                        size: "full",
                        aspectRatio: "20:13",
                        aspectMode: "cover",
                    },
                    body: {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "text",
                                text: "Payment Slip",
                                weight: "bold",
                                size: "xl",
                                align: "center"
                            },
                            {
                                type: "text",
                                text: "Thank you for your payment!",
                                color: "#666666",
                                size: "sm",
                                align: "center"
                            }
                        ]
                    }
                }
            }
        ]
    };
    console.log('passed upload');
    console.log(lineMessage);
    await axios.post(`https://api.line.me/v2/bot/message/push`, lineMessage, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        },
    });

    res.json({ message: "Payment slip sent successfully to LINE!" });
} catch (error) {
    console.error("Error sending image:", error);
    res.status(500).json({ message: "Error sending image" });
} finally {
    fs.unlinkSync(req.file.path); // Remove the uploaded file after processing
}
});
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
