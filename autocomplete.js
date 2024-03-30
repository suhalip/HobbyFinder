document.addEventListener('DOMContentLoaded', function() {
    const accessToken = 'pk.eyJ1Ijoic3VoYWxpcCIsImEiOiJjbHUxbGd6NGEwNGd1Mmtxc2dxY253c29rIn0.LKWiME2h5p4K_PsuDBuXHA';
    const locationInput = document.getElementById('my-location-input');
    const suggestionsDropdown = document.getElementById('suggestions-dropdown');

    locationInput.addEventListener('input', function(e) {
        const searchText = e.target.value;
        if (searchText.length > 2) { // To reduce requests, search after 2 characters
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${accessToken}&types=country,region,place,postcode,locality,neighborhood`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    suggestionsDropdown.innerHTML = '';
                    data.features.forEach((feature) => {
                        const option = document.createElement('div');
                        option.textContent = feature.place_name;
                        option.onclick = function() {
                            locationInput.value = feature.place_name;
                            suggestionsDropdown.style.display = 'none';
                        };
                        suggestionsDropdown.appendChild(option);
                    });
                    if(data.features.length > 0) {
                        suggestionsDropdown.style.display = 'block';
                    } else {
                        suggestionsDropdown.style.display = 'none';
                    }
                })
                .catch(err => console.error(err));
        } else {
            suggestionsDropdown.style.display = 'none';
        }
    });
});
