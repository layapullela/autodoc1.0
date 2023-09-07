import pandas as pd
import ast
import argparse
import csv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re

def additional_symptoms(my_symptoms): 
    my_symptoms = [sym.lower().replace("\n", "") for sym in my_symptoms]
    with open('database/symptoms.txt', 'r') as f:
        symptoms = f.read().splitlines()

    #we want to remove all the puncuation, strip and convert to lower case
    corpus = [re.sub(r'[^\w\s]', '', sym.lower().strip()) for sym in symptoms]
    vectorizer = TfidfVectorizer()
    vectorizer.fit(corpus)
    description_matrix = vectorizer.transform(corpus)

    results = []

    my_symptoms = [re.sub(r'[^\w\s]', '', sym.lower().strip()) for sym in my_symptoms]
    input_vector = vectorizer.transform(my_symptoms)
    cosine_similarities = cosine_similarity(input_vector, description_matrix)
    top_6_indices = cosine_similarities[0].argsort()[-6:][::-1]
    for i in top_6_indices: 
        if( symptoms[i].lower() not in my_symptoms ): 
            results.append(symptoms[i])
    
    return ", ".join(list(set(results)))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process user text.')
    parser.add_argument('--function', type=str, help='The name of the function to run.')
    parser.add_argument('--symptoms', type=str, help='The already added symptoms.')

    args = parser.parse_args()


    if args.function == 'additional_symptoms':
        result = additional_symptoms(args.symptoms.split(", "))
        print(result, end="")
