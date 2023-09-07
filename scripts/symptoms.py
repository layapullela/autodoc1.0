import json
import requests
import argparse

def query(payload, API_URL, headers):
    data = json.dumps(payload)
    response = requests.request("POST", API_URL, headers=headers, data=data)
    return json.loads(response.content.decode("utf-8"))

def get_sym(inputtext):

    headers = {"Authorization": f"Bearer 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"}
    API_URL = "https://api-inference.huggingface.co/models/pmaitra/en_biobert_ner_symptom"

    data = query({"inputs": inputtext, "options": {"wait_for_model": True}}, API_URL, headers)

    return ", ".join([item['word'] for item in data])

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process user text.')
    parser.add_argument('--function', type=str, help='The name of the function to run.')
    parser.add_argument('--userText', type=str, help='The text to process.')

    args = parser.parse_args()

    if args.function == 'get_sym':
        result = get_sym(args.userText)
        print(result, end="")