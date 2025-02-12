import sqlite3

def read_sqlite_db(db_path):
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Execute a query to retrieve all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    # Print all table names
    print("Tables in the database:")
    for table in tables:
        print(table[0])

    # Close the connection
    conn.close()

def get_sentence(text):
    sentences = text.split('.')
    return sentences[0]+"."
    
def print_distinct_genres(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Query to select distinct genres from the genres table
    cursor.execute("SELECT DISTINCT genre FROM genres;")
    genres = cursor.fetchall()
    
    print("Distinct genres:")
    for genre in genres:
        print(genre[0])
    
    conn.close()


def get_sample(row):
    # Extract the relevant columns
    reviewid = row[0]
    artist = row[1]
    album = row[2]
    score = row[4]
    text = row[14]
    genre = row[16]

    print(reviewid, artist, album, score, genre, get_sentence(text))


def join_tables(db_path):
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Execute a query to join the tables
    cursor.execute("""
        SELECT * FROM reviews
        JOIN content ON reviews.reviewid = content.reviewid
        JOIN genres ON reviews.reviewid = genres.reviewid;
    """)
    rows = cursor.fetchall()

    # Print the first 5 rows
    print("First 5 rows of the joined tables:")
    for row in rows[:5]:
        get_sample(row)

    # Close the connection
    conn.close()

# Example usage
if __name__ == "__main__":
    db_path = 'C:\\forkle2\\PitchforkData\\database.sqlite'
    read_sqlite_db(db_path)
    print_distinct_genres(db_path)
    join_tables(db_path)