import pandas as pd
import gensim
import argparse
import numpy as np
import re 

# Sample dataframe with descriptions and categories

def embed_text(input): 
    embed = gensim.utils.unpickle("embedding")
    sentence_embedding = []

    for word in input.split(): 
        token_id = embed['token_to_id'].get(re.sub(r'[^\w\s]', '', word.lower()))
        if token_id is not None:
            word_embedding = embed['word_embedding'][token_id]
            sentence_embedding.append(word_embedding)

    sentence_embedding = np.array(sentence_embedding)
    sentence_vec = np.mean(sentence_embedding, axis=0)
    
    return sentence_vec


def cosine_similarities(vec_a, vec_b):
    dot_product = np.dot(vec_a, vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    return dot_product / (norm_a * norm_b)

def top_3_categories(input_text):
    df = pd.read_csv("database/mayo_dataset.csv")
    query_vector = embed_text(input_text)

    # Compute cosine similarity between the query and each description
    similarities = []
    for index, row in df.iterrows():
        if(pd.notna(row['Symptoms'])):
            description_vector = embed_text(row['Symptoms'])

            similarity = cosine_similarities(query_vector, description_vector)
            similarities.append(similarity)
        else: 
            similarities.append(0)

    #Add the computed similarities to the DataFrame
    similarities = [1/(sim**2) if sim != 0 else 0 for sim in similarities]
    df['Similarity'] = similarities * np.array(1 + df['Commonness Score']/60)
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