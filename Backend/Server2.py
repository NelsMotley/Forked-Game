import requests
from flask import Flask, jsonify
import sqlite3
import random
from flask_cors import CORS
import threading
import time
import string
import os


question_bank_lock = threading.Lock()
question_bank = []

easy = []
medium = []
hard = []

class Album:
    def __init__(self, title, artist, score, genre, content, popularity, link, reviewer, review_date):
        """
        Initialize an Album object with title, artist, and score.
        
        Parameters:
        title (str): The title of the album
        artist (str): The artist or band name
        score (float): Rating or score for the album (e.g., 0-10)
        genre (str): Genre of the release
        content (str): Text content of the review 
        """
        self._title = title
        self._artist = artist
        self._score = score
        self._genre = genre
        self._content = content
        self._popularity = popularity
        self._link = link
        self._reviewer = reviewer
        self._review_date = review_date
        self._quote = self._extract_quote()

    def __str__(self):
        """Return a human-readable string representation of the object"""
        return f"Album(title='{self._title}', artist={self._artist}, score={self._score}, genre={self._genre})"

    def get_title(self):
        return self._title
    
    def get_artist(self):
        return self._artist
    
    def get_score(self):
        return self._score
    
    def get_genre(self):
        return self._genre
    
    def get_content(self):
        return self._content
    
    def get_popularity(self):
        return self._popularity
    
    def get_link(self):
        return self._link
    
    def get_reviewer(self):
        return self._reviewer
    
    def get_review_date(self):
        return self._review_date
    
    def get_quote(self):
        """Return the automatically extracted quote"""
        return self._quote
    
    def _extract_quote(self):
        """Extract a quote from the content (first sentence less than 70 chars)"""
        import re
        
        if not self._content:
            return None
            
        sentences = re.split(r'(?<=[.!?])\s+', self._content)
        
        for sentence in sentences:
            if len(sentence) < 250:
                return sentence
            
        return None
    

class Question:
    def __init__(self, type, albums, correct_index=None):
        """
        Initialize a Question with a prompt and 4 album options.
        
        Parameters:
        type (str): The type of question
        albums (list): A list of 4 Album objects
        correct_index (int, optional): Index of the correct album answer (0-3)
        """
        if len(albums) != 4:
            raise ValueError("Question must contain exactly 4 albums")
        
        self._type = type
        self._albums = albums
        self._correct_index = correct_index

    def __str__(self):
        """Return a human-readable string representation of the object"""
        return f"Question(Correct_album='{self._albums[self._correct_index]}')"
    
    @property
    def type(self):
        return self._type
    
    @property
    def albums(self):
        return self._albums
    
    @property
    def correct_album(self):
        if self._correct_index is not None:
            return self._albums[self._correct_index]
        return None
    

class Puzzle:
    def __init__(self, easy, easy_scores, easy_genres, medium, medium_scores, medium_genres, hard, hard_scores, hard_genres):
        '''
        The structures to be stored in the question bank.
        '''
        self._easy = easy
        self._easy_scores = easy_scores
        self._easy_genres = easy_genres

        self._medium = medium
        self._medium_scores = medium_scores
        self._medium_genres = medium_genres

        self._hard = hard
        self._hard_scores = hard_scores
        self._hard_genres = hard_genres

    def get_easy(self):
        return self._easy
    
    def get_easy_scores(self):
        return self._easy_scores
    
    def get_easy_genres(self):
        return self._easy_genres
    
    def get_medium(self):
        return self._medium

    def get_medium_scores(self):
        return self._medium_scores

    def get_medium_genres(self):
        return self._medium_genres

    def get_hard(self):
        return self._hard

    def get_hard_scores(self):
        return self._hard_scores

    def get_hard_genres(self):
        return self._hard_genres
        





question_bank = []

def make_easy(n):
    albums = []
    count = 0
    
    
    max_attempts = len(easy) 
    attempts = 0
    
    
    while count < n and attempts < max_attempts:
       
        random_selection = random.sample(easy, 1)[0]
        attempts += 1
        
       
        if random_selection[17] is None:
            continue
            
        album = Album(
            artist=random_selection[1], 
            score=random_selection[7], 
            title=random_selection[4], 
            genre=random_selection[17], 
            content=random_selection[19], 
            link=random_selection[6], 
            popularity=random_selection[2], 
            reviewer=random_selection[9], 
            review_date=random_selection[11]
        )
        
        albums.append(album)
        count += 1
    
    return albums


def make_hard(n):
    albums = []
    count = 0

    max_attempts = len(hard)
    attempts = 0
    
    while count < n and attempts < max_attempts:
        
        random_selection = random.sample(hard, 1)[0]
        attempts += 1
        
       
        if random_selection[17] is None:
            continue
            
        album = Album(
            artist=random_selection[1], 
            score=random_selection[7], 
            title=random_selection[4], 
            genre=random_selection[17], 
            content=random_selection[19], 
            link=random_selection[6], 
            popularity=random_selection[2], 
            reviewer=random_selection[9], 
            review_date=random_selection[11]
        )
        
        albums.append(album)
        count += 1
    
    return albums


def make_medium(n):
    albums = []
    count = 0
    
   
    max_attempts = len(medium)
    attempts = 0
    
    
    while count < n and attempts < max_attempts:
       
        random_selection = random.sample(medium, 1)[0]
        attempts += 1
        
    
        if random_selection[17] is None:
            continue
            
        album = Album(
            artist=random_selection[1], 
            score=random_selection[7], 
            title=random_selection[4], 
            genre=random_selection[17], 
            content=random_selection[19], 
            link=random_selection[6], 
            popularity=random_selection[2], 
            reviewer=random_selection[9], 
            review_date=random_selection[11]
        )
        
        albums.append(album)
        count += 1
    
    return albums



def make_questions(count):
    easy_question = Question(type="easy", albums=make_easy(4), correct_index=0)
    medium_question = Question(type="medium", albums=make_medium(4), correct_index=0)
    hard_question = Question(type="hard", albums=make_hard(4), correct_index=0)
    return [easy_question, medium_question, hard_question]


def split_difficulty(reviews):
    for review in reviews:
        if review[2] is None:
            continue
        if review[2] > 70:
            easy.append(review)
        elif review[2] > 40:
            medium.append(review)
        else:
            hard.append(review)



genre_options = ["electronic", "metal", "rock", "rap", "experimental", "pop/r&b", "folk/country", "jazz", "global"]

def generate_genre_list(specified_genre):
    if specified_genre not in genre_options:
        raise ValueError(f"Specified genre '{specified_genre}' is not in the genre options")
    
    remaining_genres = [genre for genre in genre_options if genre != specified_genre]
    
    selected_genres = random.sample(remaining_genres, 3)
    
    result = [specified_genre] + selected_genres
    
    random.shuffle(result)
    
    return result



def generate_quotes(question: Question):
    quote_list = []
    for album in question.albums:
        quote_list.append(album.get_quote())
    random.shuffle(quote_list)
    return quote_list

def generate_scores(original_float):
    result = []
    
    while len(result) < 3:
        new_float = random.uniform(0, 10.0)
        if abs(new_float - original_float) > 1e-10:
            result.append(new_float)
    
    result.append(original_float)
    random.shuffle(result)
    return result


def build_puzzle(correct_score, correct_genre, question):
    scores = generate_scores(correct_score)
    genres = generate_genre_list(correct_genre)
    return [scores, genres]

def fill_bank(n):
    i = 0
    while i < 50:
        questions = make_questions(0)
        easy_question = questions[0]
        easy_stuff = build_puzzle(question=easy_question, correct_score=easy_question.correct_album.get_score(), correct_genre=easy_question.correct_album.get_genre())

        medium_question = questions[1]
        medium_stuff = build_puzzle(question=medium_question, correct_score=medium_question.correct_album.get_score(), correct_genre=medium_question.correct_album.get_genre())

        hard_question = questions[2]
        hard_stuff = build_puzzle(question=hard_question, correct_score=hard_question.correct_album.get_score(), correct_genre=hard_question.correct_album.get_genre())
        puzzle = Puzzle(easy=easy_question, easy_scores=easy_stuff[0], easy_genres=easy_stuff[1], medium=medium_question, medium_scores=medium_stuff[0], medium_genres=medium_stuff[1], hard=hard_question, hard_scores=hard_stuff[0], hard_genres=hard_stuff[1])
        with question_bank_lock:
            question_bank.append(puzzle)
        i += 1

def capitalize_words(text):
    return ' '.join(word.capitalize() for word in text.split())



def start_up():
    db_path = os.environ.get('DATABASE_PATH', 'PitchforkData/database.sqlite')
    print(f"Attempting to connect to database at: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Execute your query
        query = '''
            SELECT * FROM Merged_artist
            JOIN reviews ON Merged_artist.reviewid = reviews.reviewid
            JOIN genres ON Merged_artist.reviewid = genres.reviewid
            JOIN content ON Merged_artist.reviewid = content.reviewid
        '''
        
        cursor.execute(query)
        results = cursor.fetchall()
        print(f"Retrieved {len(results)} results from database")
        
        split_difficulty(results)
        print(f"Easy: {len(easy)}, Medium: {len(medium)}, Hard: {len(hard)}")
        
        fill_bank(0)
        print(f"Question bank filled with {len(question_bank)} questions")
        
        conn.close()
    except Exception as e:
        print(f"Error in start_up: {str(e)}")
        raise


print("Initializing database...")
start_up()
fill_bank(50)
print(f"Question bank initialized with {len(question_bank)} questions")

''' Server CODE'''
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/check-db')
def check_db():
    db_path = os.environ.get('DATABASE_PATH', 'PitchforkData/database.sqlite')
    result = {
        "db_path": db_path,
        "file_exists": os.path.exists(db_path),
        "directory_contents": os.listdir(os.path.dirname(db_path) if '/' in db_path else '.'),
        "working_directory": os.getcwd()
    }
    return jsonify(result)

@app.route('/check-bank')
def check_bank():
    return jsonify({
        "question_bank_size": len(question_bank),
        "easy_count": len(easy),
        "medium_count": len(medium),
        "hard_count": len(hard)
    })

@app.route('/api/review', methods=['GET'])
def get_review():
     try:
        print("Getting review")
        
        global question_bank
        print("Checking question bank", len(question_bank))

        
        selected = None
        with question_bank_lock:
            if len(question_bank) == 0:
                return jsonify({'error': 'No questions available.'})
            selected = question_bank.pop()

        easy_question = selected.get_easy()
        easy_scores = selected.get_easy_scores()
        easy_genres = selected.get_easy_genres()
        easy_quotes = generate_quotes(easy_question)
        easy_link = easy_question.correct_album.get_link()

        medium_question = selected.get_medium()
        medium_scores = selected.get_medium_scores()
        medium_genres = selected.get_medium_genres()
        medium_quotes = generate_quotes(medium_question)
        medium_link = medium_question.correct_album.get_link()

        hard_question = selected.get_hard()
        hard_scores = selected.get_hard_scores()
        hard_genres = selected.get_hard_genres()
        hard_quotes = generate_quotes(hard_question)
        hard_link = hard_question.correct_album.get_link()

        
        questions_data = {
            "easy": {
                "title": "Easy",
                "correct_title": capitalize_words(easy_question.correct_album.get_title()),
                "correct_artist": capitalize_words(easy_question.correct_album.get_artist()),
                "correct_genre": easy_question.correct_album.get_genre(),
                "correct_quote": easy_question.correct_album.get_quote(),
                "correct_score": easy_question.correct_album.get_score(),
                "link": easy_link,
                "scores": {
                    "s1": float(f'{easy_scores[0]:.1f}'),
                    "s2": float(f'{easy_scores[1]:.1f}'),
                    "s3": float(f'{easy_scores[2]:.1f}'),
                    "s4": float(f'{easy_scores[3]:.1f}')
                },
                "genres":{
                    "g1": easy_genres[0],
                    "g2": easy_genres[1],
                    "g3": easy_genres[2],
                    "g4": easy_genres[3]
                },
                "quotes":{
                    "q1": easy_quotes[0],
                    "q2": easy_quotes[1],
                    "q3": easy_quotes[2],
                    "q4": easy_quotes[3]
                }
            },
            "medium":{
                "title": "medium",
                "correct_title": capitalize_words(medium_question.correct_album.get_title()),
                "correct_artist": capitalize_words(medium_question.correct_album.get_artist()),
                "correct_genre": medium_question.correct_album.get_genre(),
                "correct_quote": medium_question.correct_album.get_quote(),
                "correct_score": medium_question.correct_album.get_score(),
                "link": medium_link,
                "scores": {
                    "s1": float(f'{medium_scores[0]:.1f}'),
                    "s2": float(f'{medium_scores[1]:.1f}'),
                    "s3": float(f'{medium_scores[2]:.1f}'),
                    "s4": float(f'{medium_scores[3]:.1f}')
                },
                "genres":{
                    "g1": medium_genres[0],
                    "g2": medium_genres[1],
                    "g3": medium_genres[2],
                    "g4": medium_genres[3]
                },
                "quotes":{
                    "q1": medium_quotes[0],
                    "q2": medium_quotes[1],
                    "q3": medium_quotes[2],
                    "q4": medium_quotes[3]
                }
            },
            "hard" : {
                "title": "hard",
                "correct_title": capitalize_words(hard_question.correct_album.get_title()),
                "correct_artist": capitalize_words(hard_question.correct_album.get_artist()),
                "correct_genre": hard_question.correct_album.get_genre(),
                "correct_quote": hard_question.correct_album.get_quote(),
                "correct_score": hard_question.correct_album.get_score(),
                "link": hard_link,
                "scores": {
                    "s1": float(f'{hard_scores[0]:.1f}'),
                    "s2": float(f'{hard_scores[1]:.1f}'),
                    "s3": float(f'{hard_scores[2]:.1f}'),
                    "s4": float(f'{hard_scores[3]:.1f}')
                },
                "genres":{
                    "g1": hard_genres[0],
                    "g2": hard_genres[1],
                    "g3": hard_genres[2],
                    "g4": hard_genres[3]
                },
                "quotes":{
                    "q1": hard_quotes[0],
                    "q2": hard_quotes[1],
                    "q3": hard_quotes[2],
                    "q4": hard_quotes[3]
                }
            }

        }
        return jsonify(questions_data)
     except Exception as e:
        return jsonify({'error': str(e)}), 500
     
@app.after_request
def after_request_func(response):
    # Run the bank check/refill asynchronously after the request is completed
    if len(question_bank) < 150:
        threading.Thread(target=fill_bank, args=(0,), daemon=True).start()
    return response

def test():
    global question_bank
    print("Checking question bank", len(question_bank))
    
    selected = None
    with question_bank_lock:
        if len(question_bank) == 0:
            return jsonify({'error': 'No questions available.'})
        selected = question_bank.pop()

    easy_question = selected.get_easy()
    easy_scores = selected.get_easy_scores()
    easy_genres = selected.get_easy_genres()
    easy_quotes = generate_quotes(easy_question)
    
    questions_data = {
        "easy": {
            "title": "Easy",
            "correct_title": easy_question.correct_album.get_title(),
            "correct_artist": easy_question.correct_album.get_artist(),
            "correct_genre": easy_question.correct_album.get_genre(),
            "correct_quote": easy_question.correct_album.get_quote(),
            "correct_score": easy_question.correct_album.get_score(),
            "scores": {
                "s1": easy_scores[0],
                "s2": easy_scores[1],
                "s3": easy_scores[2],
                "s4": easy_scores[3]
            },
            "genres":{
                "g1": easy_genres[0],
                "g2": easy_genres[1],
                "g3": easy_genres[2],
                "g4": easy_genres[3]
            },
            "quotes":{
                "q1": easy_quotes[0],
                "q2": easy_quotes[1],
                "q3": easy_quotes[2],
                "q4": easy_quotes[3]
            }



        }
    }

    print(questions_data)


if __name__ == '__main__':
    start_up()
    fill_bank(50)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))