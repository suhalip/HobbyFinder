api_key = "KEY"
keyword = "fishing"

import requests

hobby = 'YOUR_HOBBY_HERE'

url = f'https://app.ticketmaster.com/discovery/v2/events.json?apikey={api_key}&keyword={keyword}'
response = requests.get(url)


if response.status_code == 200:
    data = response.json()
    events = data['_embedded']['events']
    for event in events:
        name = event['name']
        date = event['dates']['start']['localDate']
        time = event['dates']['start'].get('localTime', 'Time not specified')
        location = event['_embedded']['venues'][0]
        city = location['city']['name']
        state = location['state']['name']
        print(f"Event: {name}\nDate: {date}\nTime: {time}\nLocation: {location['name']}\nCity: {city}\nState: {state}\n")
else:
    print('Failed to fetch events:', response.status_code, response.text)