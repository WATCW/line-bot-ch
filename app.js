const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const LINE_CHANNEL_ACCESS_TOKEN = "YOUR_LINE_CHANNEL_ACCESS_TOKEN";  // Set your actual access token here

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

app.post("/send-image", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
    }

    try {
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString("base64");

        const lineMessage = {
            messages: [
                {
                    type: "flex",
                    altText: "Payment Slip Received",
                    contents: {
                        type: "bubble",
                        hero: {
                            type: "image",
                            url: `data:image/jpeg;base64,${base64Image}`,
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

        await axios.post(`https://api.line.me/v2/bot/message/reply`, lineMessage, {
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
        fs.unlinkSync(req.file.path);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
