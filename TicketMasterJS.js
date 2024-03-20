document.getElementById('search_form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const form = document.getElementById('search_form');
    const query = form.elements['q'].value;
    let location = form.elements['l'].value;
    let date = form.elements['date'].value;

    // Check if location input is empty, and set it to empty string if it is
    location = location.trim() === '' ? '' : location;

    const api_key = 'KEY';
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${api_key}&keyword=${query}`;

    // Add location and date to the URL only if they are not empty
    if (location) {
        url += `&city=${location}`;
    }
    if (date) {
        // Convert the date to ISO 8601 format
        const isoDate = new Date(date).toISOString().split('T')[0];
        url += `&startDateTime=${isoDate}T00:00:00Z`;

        console.log('Date sent to API:', isoDate); // Log the date being sent to the API
    }

    console.log('URL:', url); // Log the URL to check if the date filter is included

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const events = data['_embedded']['events'];

        // Sort events by date in ascending order
        events.sort((a, b) => {
            const dateA = new Date(a['dates']['start']['localDate']);
            const dateB = new Date(b['dates']['start']['localDate']);
            return dateA - dateB;
        });

        const resultsDiv = document.getElementById('search_results');
        // Clear existing results before appending new ones
        resultsDiv.innerHTML = '';
        events.forEach(event => {
            const eventName = event['name'];
            const eventDate = event['dates']['start']['localDate'];
            const eventTime = event['dates']['start'].hasOwnProperty('localTime') ? event['dates']['start']['localTime'] : 'Time not specified';
            const eventLocation = event['_embedded']['venues'][0]['name'];
            const eventCity = event['_embedded']['venues'][0]['city']['name'];
            const eventState = event['_embedded']['venues'][0]['state']['name'];
            const eventImages = event['images'];
            const eventImageURL = eventImages.length > 0 ? eventImages[0]['url'] : 'No image available';

            const eventDiv = document.createElement('div');
            eventDiv.innerHTML = `
                <strong>${eventName}</strong><br>
                Date: ${eventDate}<br>
                Time: ${eventTime}<br>
                Location: ${eventLocation}, ${eventCity}, ${eventState}<br>
                <img src="${eventImageURL}" alt="Event Image"><br><br>`;
            resultsDiv.appendChild(eventDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching events:', error);
        const resultsDiv = document.getElementById('search_results');
        resultsDiv.innerHTML = 'Failed to fetch events. Please try again later.';
    });

});

