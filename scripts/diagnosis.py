import pandas as pd
import gensim
import argparse
import numpy as np
import re 
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Sample dataframe with descriptions and categories
def get_tfidf(input, data):
    data['Symptoms'].fillna('', inplace=True)
    data['Symptoms'] = data['Symptoms'].apply(lambda x: ' '.join(x.lower() for x in x.split()))
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(data['Symptoms'])
    query_tfidf = tfidf_vectorizer.transform([input])
    cosine_similarities = cosine_similarity(query_tfidf, tfidf_matrix)
    return cosine_similarities[0]

def makeweights(input): 
    weightlst = []
    words = input.split(',')
    for i, word in enumerate(words):
        if len(weightlst) == 0 :
            weightlst.extend([1] * len(word.split()))
        else:
            weightlst.extend([weightlst[i-1] * 0.8] * len(word.split()))
    return weightlst

def embed_text(input, weighted=False): 
    embed = gensim.utils.unpickle("embedding")
    sentence_embedding = []

    for word in input.split(): 
        token_id = embed['token_to_id'].get(re.sub(r'[^\w\s]', '', word.lower()))
        if token_id is not None:
            word_embedding = embed['word_embedding'][token_id]
            sentence_embedding.append(word_embedding)

    sentence_embedding = np.array(sentence_embedding)
    weights = None
    if weighted:
        weights = makeweights(input)
        min_length = min(len(weights), len(sentence_embedding))
        sentence_embedding = sentence_embedding[:min_length]
        weights = weights[:min_length]

    sentence_vec = np.average(sentence_embedding, axis=0, weights=weights)
    
    return sentence_vec


def cosine_similarities(vec_a, vec_b):
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    return dot_product / (norm_a * norm_b)

def amplify(similarity): 
    ampsim = similarity
    while( max(ampsim) > 0.80 ): 
        ampsim = [a*b for a,b in zip(similarity, ampsim)]
    
    return ampsim

def top_3_categories(input_text):
    if input_text == "No Symptoms Detected": 
        return "No Diagnosis"

    df = pd.read_csv("database/mayo_dataset.csv")
    query_vector = embed_text(input_text, weighted=False)

    # Compute cosine similarity between the query and each description
    similarities = []
    for index, row in df.iterrows():
        if(pd.notna(row['Symptoms'])):
            description_vector = embed_text(row['Symptoms'], weighted=True)

            similarity = cosine_similarities(query_vector, description_vector)
            similarities.append(similarity)
        else: 
            similarities.append(0)

    #Add the computed similarities to the DataFrame
    df['Similarity'] = amplify( similarities ) + df['Commonness Score']/30
    df_sorted = df.sort_values(by='Similarity', ascending=False)
    top_conditions = df_sorted['Condition'].head(n=3)
    
    return ", ".join(top_conditions)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process user text.')
    parser.add_argument('--function', type=str, help='The name of the function to run.')
    parser.add_argument('--userText', type=str, help='The text to process.')

    args = parser.parse_args()

    if args.function == 'top_3_categories':
        result = top_3_categories(args.userText)
        print(result)