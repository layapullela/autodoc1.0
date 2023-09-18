import json
import requests
import argparse
import re
from fuzzywuzzy import fuzz

def basiccompare(userText): 
    results_list = []

    with open("./database/symptoms.txt", "r") as f:
        symptoms = [line.strip().lower() for line in f]

    threshold = 90
    for word in userText:
        for symptom in symptoms:
            if symptom in results_list: 
                continue
            elif symptom in userText: 
                results_list.append(symptom)
            elif fuzz.ratio(word, symptom) * (1 - abs(len(word) - len(symptom)) / max(len(word), len(symptom)))>= threshold:
                results_list.append(symptom)
    
    if len(results_list) == 0: 
        return "No Symptoms Found"
    return ", ".join(results_list)
    
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process user text.')
    parser.add_argument('--function', type=str, help='The name of the function to run.')
    parser.add_argument('--userText', type=str, help='The text to process.')

    args = parser.parse_args()

    if args.function == 'get_sym':
        result = basiccompare(args.userText)
        print(result, end="")