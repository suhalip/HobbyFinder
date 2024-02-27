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
    const api_key = 'key';// Replace with your actual OpenAI API key

    let contentQuery;

    if (query && location && date) {
        contentQuery = `Suggest places for ${query} in ${location}, around ${date} with details of the places.`;
    } else if (query && location) {
        contentQuery = `Suggest places for ${query} in ${location} with details of the places.`;
    } else if(location && date){
        contentQuery = `Suggest things to do in ${location}, around ${date}`
    } else{
        contentQuery = `Suggest places for ${query} with details of the places.`;
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

        const completionText = response.data.choices[0].message.content;
        res.send(completionText);

    } catch (error) {
        console.error('Error:', error);
        res.send('Error retrieving suggestions. Please try again.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
