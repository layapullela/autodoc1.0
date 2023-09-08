import json
import requests
import argparse
import re

def basiccompare(userText): 
    userText = userText.lower()
    results_list = []
    with open("database/symptoms.txt", "r") as f:
        for line in f:
            word = line.strip().lower()
            if word in userText:
                results_list.append(word)
        
    if len(results_list) == 0: 
        return "No Symptoms Detected"
    return ", ".join(results_list)
    
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process user text.')
    parser.add_argument('--function', type=str, help='The name of the function to run.')
    parser.add_argument('--userText', type=str, help='The text to process.')

    args = parser.parse_args()

    if args.function == 'get_sym':
        result = basiccompare(args.userText)
        print(result, end="")