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
const fetchTicketmasterEvents = async (query, location, date) => {
    const apiKey = 'key'; // Securely store and use your API key
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=${encodeURIComponent(query)}`;
    if (location) {
        url += `&city=${encodeURIComponent(location)}`;
    }
    if (date) {
        url += `&date=${encodeURIComponent(date)}`;
    }  try {
      const response = await axios.get(url);
      if (response.data && response.data._embedded && response.data._embedded.events) {
          const events = response.data._embedded.events;
      // Sort events by date
          events.sort((a, b) => new Date(a.dates.start.localDate) - new Date(b.dates.start.localDate));
      // Map and process each event to extract relevant details
          return events.map(event => {
            const eventName = event.name;
            const eventDate = event.dates.start.localDate;
            const eventTime = event.dates.start.hasOwnProperty('localTime') ? event.dates.start.localTime : 'Time not specified';
            const eventLocation = event._embedded.venues[0].name;
            const eventCity = event._embedded.venues[0].city.name;
            const eventState = event._embedded.venues[0].state ? event._embedded.venues[0].state.name : 'State not specified';
            const eventImages = event.images;
            const eventImageURL = eventImages.length > 0 ? eventImages[0].url : 'No image available';
            const eventUrl = event.url; // Get the URL for the event
            return {
                eventName,
                eventDate,
                eventTime,
                eventLocation,
                eventCity,
                eventState,
                eventImageURL,
                eventUrl
            };
        });
      } else {
          return [];
      }
  } catch (error) {
      console.error('Ticketmaster API error:', error);
      return null; // Return null or throw an error as per your error handling policy
      }
};
// Route to handle form submission
app.get('/search-hobbies', async (req, res) => {
    const query = req.query.q;
    const location = req.query.l;
    const date = req.query.date;
    const api_key = 'key';// Replace with your actual OpenAI API key
    const ticketmasterData = await fetchTicketmasterEvents(query, location, date);
  // Your existing OpenAI API call logic here
    let contentQuery = `Suggest places for ${query || ''} ${location ? 'in ' + location : ''} ${date ? 'around ' + date : ''} with details of the places.`.trim();
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
            // Assuming the response contains the data you want to display
        const completionText = response.data.choices[0].message.content;
        const formattedData = formatEventData(ticketmasterData, completionText);
        res.json(formattedData);
        //res.redirect(`/resultspage.html?results=${(formattedData)}`)
    } catch (error) {
        console.error('Error:', error);
        res.send('Error retrieving suggestions. Please try again.');
    }
});
function formatEventData(ticketmasterData, completionText) {
    return {
      suggestions: completionText.trim().split('\n').map(line => line.trim()),
      events: ticketmasterData.map(event => ({
          name: event.eventName,
          date: event.eventDate,
          time: event.eventTime,
          location: `${event.eventLocation}, ${event.eventCity}, ${event.eventState}`,
          imageUrl: event.eventImageURL,
          url: event.eventUrl
      }))
  };
}
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
