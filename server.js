const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3001; // You can use any available port

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from 'public' directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Homepage.html'));
});

// Route to handle form submission
app.post('/search-hobbies', async (req, res) => {
    const query = req.body.q; // Assuming your input field's name is 'q'
    const api_key = 'key'; // Replace with your actual OpenAI API key

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo-0613', // Choose the model you prefer
                    messages: [
        {
            role: "user",
            content: `Suggest places for someone who likes ${query}`
        }
    ],
                temperature: 0.6,
                max_tokens: 60,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api_key}`
                }
            }
        );

                // Extract completion text from the response
        const completionText = response.data.choices[0].message.content;

        // Send the completion text back to the client for display
        res.send(completionText);
    } catch (error) {
        console.error('Error:', error);
    res.send('Error retrieving suggestions. Please try again.');
}

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
