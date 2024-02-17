from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

# Ensure your API key is correctly set here
openai.api_key = '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'


@app.route('/fetch_hobbies', methods=['POST'])
def search_hobbies():
    data = request.json  # Make sure your JS sends JSON
    query = data.get('query')
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # Update to the latest model if necessary
            prompt=f"Suggest hobbies related to: {query}",
            max_tokens=50
        )
        suggestions = response.choices[0].text.strip()
        return jsonify(suggestions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
