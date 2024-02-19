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
    const query = req.body.q;
    const location = req.body.l;
    const date = req.body.date;
    const api_key = 'key'; // Replace with your actual OpenAI API key
    let contentQuery;

    if (query && location && date) {
        contentQuery = `Best places to go ${query} in ${location}, around ${date}.`;
    } else if (query && location) {
        contentQuery = `Best places to go ${query} in ${location}.`;
    } else {
        contentQuery = `Suggest places for ${query}.`;
    }
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // Choose the model you prefer
                    messages: [
        {
            role: "user",
            content: contentQuery
        }
    ],
                temperature: 0.6,
                max_tokens: 500,
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
    // Send the HTML formatted text back to the client for display
    res.send(completionText);
    } catch (error) {
        console.error('Error:', error);
    res.send('Error retrieving suggestions. Please try again.');
}

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
