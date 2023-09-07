import re
import argparse

def extract_information(sentence):
    age_pattern = r'(\d+)[\s-]year[\s-]?old'
    gender_pattern = r'\b(male|female|transgender|non-binary)\b'
    race_pattern = r'\b(Asian|African|Caucasian|Hispanic|White|Black|Native American|Latino|Indian|Middle Eastern)\b'

    age = re.search(age_pattern, sentence)
    gender = re.search(gender_pattern, sentence, re.IGNORECASE)
    race = re.search(race_pattern, sentence, re.IGNORECASE)

    return {
        'Age': age.group(1) if age else None,
        'Gender': gender.group(1) if gender else None,
        'Race': race.group(1) if race else None
    }

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process user text.')
    parser.add_argument('--function', type=str, help='The name of the function to run.')
    parser.add_argument('--userText', type=str, help='The text to process.')

    args = parser.parse_args()

    if args.function == 'extract_information':
        result = extract_information(args.userText)
        newresult = '{' + ', '.join(f'"{k}": "{v}"' for k, v in result.items()) + '}'
        print(newresult)