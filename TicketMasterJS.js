document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search_form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        const form = document.getElementById('search_form');
        const query = form.elements['q'].value;
        let location = form.elements['l'].value.trim();
        let date = form.elements['date'].value.trim();

        // Construct the URL for the result page with the search query
        let url = `ResultsPage.html?q=${query}`;

        // Add location to the URL if it's provided
        if (location !== '') {
            url += `&l=${location}`;
        }

        // Add date to the URL if it's provided
        if (date !== '') {
            url += `&date=${date}`;
        }

        // Log the values before redirecting
        console.log('Query:', query);
        console.log('Location:', location);
        console.log('Date:', date);
        console.log('Redirecting to:', url);

        // Redirect the user to the result page
        window.location.href = url;
    });
});
