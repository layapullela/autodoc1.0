# autodoc1.0
autodoc1.0
LINK: https://autodoc1-0-2341f1c6dfd1.herokuapp.com/

This app aims to parse a patient case inquiry and assign reccomendations for diagnosis. Dataset was built by web scraping Mayo Clinic pages using Beautiful Soup. Currently only the text and commonness of each diagnoses are considered as features. I hope to integrate demographic info as features with more robust data.  

Methods used: Word2Vec, TFIDF
Word2Vec model fine tuned using the original Mikolov method (https://arxiv.org/abs/1301.3781)
