const express = require('express');
const app = express();
const hostname = '127.0.0.1'; // Your server ip address
const port = 3000;
const cors = require("cors");
const OpenAI = require("openai");
const version = '1.0.0';
app.use(express.json());

// Enable CORS for your front-end
const corsOptions = {
    //origin: "http://localhost:3000",
    origin: "https://cjziems2.github.io",
    credentials: true
};
app.use(cors(corsOptions));
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});
app.get('/', (req, res) => {
    // set response content    
    res.send(`<html>
                    <body>
                        <h1 style="color:blue;text-align: center;margin-top: 100px;"> [Version ${version}]: This is AMAZING!!! Like & Subscribe!</h1>
                        <div style="position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%)">
                            <img src="https://picsum.photos/400/400?random=1">
                        </div>
                    </body>
                   </html>`);
    console.log(`[Version ${version}]: New request => http://${hostname}:${port}` + req.url);
})

app.post("/genome", async (req, res) => {
    console.log('pinged genome');
    try {
        const bod = req.body; //JSON.parse(req.body);
        console.log(bod);
        const message = bod.prompt; //req.body.message;
        console.log(message);
        console.log('message above');
        const completion = await openai.chat.completions.create({
            messages: [{ "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": message }],
            model: "gpt-3.5-turbo"
        });
        console.log(completion);
        res.status(200).json({
            message: "Finished running the prompt.",
            payload: {
                fullPrompt: message,
                result: completion.choices[0].message.content
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log(err);
        return;
    }
});

app.listen(port, () => {
    console.log(`[Version ${version}]: Server running at http://${hostname}:${port}/`);
})