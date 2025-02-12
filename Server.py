from bs4 import BeautifulSoup
import requests
from flask import Flask, jsonify
import sqlite3
import random
from flask_cors import CORS
import threading
import time

API_KEY = 'cff7070fc31b4b012bd377ab95984915'
BASE_URL = 'http://ws.audioscrobbler.com/2.0/'
question_bank_lock = threading.Lock()
question_bank = []

def read_database():
    conn = sqlite3.connect('C:\\forkle2\\PitchforkData\\database.sqlite')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM reviews')
    index = random.randint(0, 18392)
    review = cursor.fetchall()[index]
    conn.close()
    return review

def api_request(artist, album):
    params = {
    'method': 'album.getinfo',
    'artist': artist,       
    'album': album,         
    'api_key': API_KEY,
    'format': 'json'             
    }
    # Make the request
    response = requests.get(BASE_URL, params=params)

    # Check the response status
    if response.status_code == 200:
        data = response.json()
        if 'tracks' not in data['album']:
            print(f"No tracks found for {album} by {artist}")
            print(data)
            return None
        track = data['album']['tracks']['track'][0]['name']
        return track

    else:
        print(f"Bad album: {album} by {artist}")
        print(f"Error: {response.status_code}")
        return None



def create_question(review):
    #get correct answer
    track = api_request(review[2], review[1])
    while track == None:
        review = read_database()
        track = api_request(review[2], review[1])
    correct_answer = [review[1], review[2], track, review[4]]
    #get incorrect answers
    answers = [[], [], []]
    
    
    for i in range(3):
        review = read_database()
        track = api_request(review[2], review[1])
        while track == None:
            review = read_database()
            track = api_request(review[2], review[1])
        answers[i] = [review[1], review[2], track, review[4]]
    
        
    return correct_answer, answers

def get_rotations(index):
    if index == 0:
        return 0
    elif index == 1:
        return 270
    elif index == 2:
        return 90
    else:
        return 180

def shuffle_answers(correct, incorrect):
    question = [['','','',''],['','','','']]
    correct_index_1 = random.randint(0,3)
    correct_index_2 = random.randint(0,3)
    question[0][correct_index_1] = correct[2]
    question[1][correct_index_2] = correct[3]
    tracks = []
    for i in incorrect:
        tracks.append(i[2])
    scores = []
    for i in incorrect:
        scores.append(i[3])
    random.shuffle(tracks)
    random.shuffle(scores)
    for i in range(4):
        if question[0][i] == '':
            question[0][i] = tracks.pop()
    for i in range(4):  
        if question[1][i] == '':
            question[1][i] = scores.pop()
    return question, get_rotations(correct_index_1), get_rotations(correct_index_2)
    

def get_sentence(text):
    sentences = text.split('.')
    return sentences[0]+"."

def get_sample(row):
    # Extract the relevant columns
    reviewid = row[0]
    artist = row[1]
    album = row[2]
    score = row[4]
    text = row[14]
    genre = row[16]

    return [reviewid, artist, album, score, genre, get_sentence(text)]


def refill_question_bank():
    global question_bank
    db_path = 'C:\\forkle2\\PitchforkData\\database.sqlite'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM reviews
        JOIN content ON reviews.reviewid = content.reviewid
        JOIN genres ON reviews.reviewid = genres.reviewid
        ORDER BY RANDOM() 
        LIMIT 50;
    """)
    rows = cursor.fetchall()

    with question_bank_lock:
        for row in rows:
            question_bank.append(get_sample(row))
    
    conn.close()
    print("Refilled question bank with 50 more options.")


def check_question_bank():
    global question_bank
    with question_bank_lock:
        should_refill = len(question_bank) < 150
    if should_refill:
        threading.Thread(target=refill_question_bank, daemon=True).start()

score_options = ["0.0-1.9", "2.0-3.9", "4.0-5.9", "6.0-7.9", "8.0-10.0"]

genre_options = ["electronic", "metal", "rock", "rap", "experimental", "pop/r&b", "folk/country", "jazz", "global"]

def get_bracket(score):
    print(score)
    if score < 2:
        return score_options[0]
    elif score < 4:
        return score_options[1]
    elif score < 6:
        return score_options[2]
    elif score < 8:
        return score_options[3]
    else:
        return score_options[4]
    
def false_options(correct_score):
    options = []
    for i in score_options:
        if i != correct_score:
            options.append(i)
    return random.sample(options, 3)

def build_ring_and_key(correct, incorrect):
    blank = ["", "", "", ""]
    correct_index_1 = random.randint(0,3)
    blank[correct_index_1] = correct
    for i in range(4):
        if blank[i] == "":
            blank[i] = incorrect.pop()
    return blank, correct

def get_false_genres(correct_genre):
    options = []
    for i in genre_options:
        if i != correct_genre:
            options.append(i)
    return random.sample(options, 3)

def build_puzzle(options):
    
    #pick correct answer
    
    puzzle =[]
    answers = [] 
    correct = options[0]
    incorrect = options[1:]
    score = correct[3]

    #build score question
    correct_score = get_bracket(score)
    incorrect_scores = false_options(correct_score)
    ring, key = build_ring_and_key(correct_score, incorrect_scores)
    puzzle.append(ring)
    answers.append(key)
    
    
    #build genre question
    correct_genre = correct[4]
    print(correct_genre)
    
    incorrect_genres = get_false_genres(correct_genre)
    ring, key = build_ring_and_key(correct_genre, incorrect_genres)
    puzzle.append(ring)
    answers.append(key)
    print(ring, key)
    #build sentence question
    
    correct_sentence = correct[5]
    print(correct_sentence)
    
    incorrect_sentences = []
    for i in incorrect:
        incorrect_sentences.append(i[5])
    ring, key = build_ring_and_key(correct_sentence, incorrect_sentences)
    puzzle.append(ring)
    answers.append(key)

    return correct, puzzle, answers


def score_range(score, exact):
    print(score)
    
    upper, lower = score.split('-')
    lower, upper = float(lower), float(upper)
    tmp = [random.uniform(lower, upper), random.uniform(lower, upper)]
    if exact == tmp[0]:
        if tmp[0] > lower:
            tmp[0] = tmp[0] - 0.1
        else:
            tmp[0] = tmp[0] + 0.1
    if exact == tmp[1]:
        if tmp[1] > lower:
            tmp[1] = tmp[1] - 0.1
        else:
            tmp[1] = tmp[1] + 0.1
    
    tmp.append(exact)
    random.shuffle(tmp)
    return tmp[0], tmp[1], tmp[2]
    





app = Flask(__name__)
CORS(app)

def start_up():
    db_path = 'C:\\forkle2\\PitchforkData\\database.sqlite'
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Execute a query to join the tables
    cursor.execute("""
        SELECT * FROM reviews
        JOIN content ON reviews.reviewid = content.reviewid
        JOIN genres ON reviews.reviewid = genres.reviewid
        ORDER BY RANDOM() 
        LIMIT 200;
    """)
    rows = cursor.fetchall()
    
    for row in rows:
        question_bank.append(get_sample(row))

    # Close the connection
    conn.close()
    

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/api/review', methods=['GET'])
def get_review():
    print("Getting review")
    
    selected = []
    global question_bank
    print("Checking question bank", len(question_bank))
    check_question_bank()
    with question_bank_lock:
        if len(question_bank) == 0:
            return jsonify({'error': 'No questions available.'})
        selected = random.sample(question_bank, 4)
        for option in selected:
            question_bank.remove(option)
    
    correct, puzzle, answers = build_puzzle(selected)
    option1, option2, option3 = [round(opt, 1) for opt in score_range(answers[0], correct[3])]

    print(option1, option2, option3)
    
    return jsonify({'correct': correct, 
                    'ring1': puzzle[0], 
                    'ring2': puzzle[1],
                    'ring3': puzzle[2],
                    'score1': puzzle[0][0],
                    'score2': puzzle[0][1],
                    'score3': puzzle[0][2],
                    'score4': puzzle[0][3],
                    'genre1': puzzle[1][0],
                    'genre2': puzzle[1][1],
                    'genre3': puzzle[1][2],
                    'genre4': puzzle[1][3],
                    'sentence1': puzzle[2][0],
                    'sentence2': puzzle[2][1],
                    'sentence3': puzzle[2][2],
                    'sentence4': puzzle[2][3],
                    'answer1': answers[0],
                    'answer2': answers[1],
                    'answer3': answers[2],
                    'option1': option1,
                    'option2': option2,
                    'option3': option3,
                    'album': correct[1],
                    'artist': correct[2],
                    'score': correct[3]})


@app.after_request
def after_request_func(response):
    # Run the bank check/refill asynchronously after the request is completed
    if len(question_bank) < 150:
        threading.Thread(target=refill_question_bank, daemon=True).start()
    return response


if __name__ == '__main__':
    start_up()
    app.run(debug=True)



