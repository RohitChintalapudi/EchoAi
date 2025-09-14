
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const API_KEY = "MY_API_KEY";

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
                { text: userMessage }
            ],
          },
        ],
      },
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch response" });
  }
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
