import os
import time
import json
import base64
import requests
from dotenv import load_dotenv
from datetime import datetime
import logging
from typing import Dict, Any, Optional, List
import backoff
import sqlite3
import csv

name_cache = set()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("spotify_api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("spotify_api")

class SpotifyAPI:
    BASE_URL = "https://api.spotify.com/v1/"
    AUTH_URL = "https://accounts.spotify.com/api/token"

    def __init__(self, client_id: str, client_secret: str, requests_per_sec: float = 0.8):
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token = None
        self.token_expiry = 0
        self.request_interval = 1.0 / requests_per_sec
        self.last_request_time = 0
       
    # Fixed method name (removed underscore from beginning)
    def get_auth_header(self) -> Dict[str, str]:
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_bytes = auth_string.encode("utf-8")
        auth_base64 = base64.b64encode(auth_bytes).decode("utf-8")
        return {
            "Authorization": f"Basic {auth_base64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    
    def _ensure_token(self) -> None:
        """Ensure we have a valid access token"""
        current_time = time.time()
        
        # If token is expired or doesn't exist, get a new one
        if not self.access_token or current_time >= self.token_expiry:
            logger.info("Getting new access token")
            # Fixed method name reference to match the method name above
            auth_header = self.get_auth_header()
            data = {"grant_type": "client_credentials"}
            
            response = requests.post(self.AUTH_URL, headers=auth_header, data=data)
            if response.status_code != 200:
                logger.error(f"Failed to get token: {response.status_code} - {response.text}")
                response.raise_for_status()
                
            response_data = response.json()
            self.access_token = response_data.get("access_token")
            expires_in = response_data.get("expires_in", 3600)  # Default to 1 hour if not specified
            self.token_expiry = current_time + expires_in - 60  # Renew 60 seconds before expiry

    def _api_request_headers(self) -> Dict[str, str]:
        """Get headers for API requests"""
        self._ensure_token()
        return {"Authorization": f"Bearer {self.access_token}"}
    
    def _rate_limit(self) -> None:
        """Implement rate limiting for API requests"""
        current_time = time.time()
        time_since_last_request = current_time - self.last_request_time
        
        if time_since_last_request < self.request_interval:
            sleep_time = self.request_interval - time_since_last_request
            logger.debug(f"Rate limiting: sleeping for {sleep_time:.2f} seconds")
            time.sleep(sleep_time)
            
        self.last_request_time = time.time()
    
    # Fixed decorator implementation - moved it above the method
    @backoff.on_exception(
        backoff.expo,
        (requests.exceptions.RequestException, requests.exceptions.HTTPError),
        max_tries=5,
        giveup=lambda e: isinstance(e, requests.exceptions.HTTPError) and e.response.status_code == 404
    )
    def make_request(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Make a rate-limited request to the Spotify API with exponential backoff for retries
        
        Args:
            endpoint: API endpoint to call
            params: Query parameters for the request
            
        Returns:
            JSON response from the API
        """
        self._rate_limit()
        headers = self._api_request_headers()
        url = f"{self.BASE_URL}{endpoint}"
        
        logger.debug(f"Making request to {url} with params {params}")
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 429:  # Rate limited
            retry_after = int(response.headers.get('Retry-After', '1'))
            logger.warning(f"Rate limited! Waiting for {retry_after} seconds")
            time.sleep(retry_after)
            return self.make_request(endpoint, params)  # Retry the request
            
        # Raise exception for other error status codes
        response.raise_for_status()
        return response.json()
    
    def search_artist(self, artist_name: str) -> Optional[Dict[str, Any]]:
        """
        Search for an artist by name
        
        Args:
            artist_name: Name of the artist to search for
            
        Returns:
            First artist result or None if not found
        """
        params = {
            "q": artist_name,
            "type": "artist",
            "limit": 1
        }
        
        try:
            results = self.make_request("search", params)
            artists = results.get("artists", {}).get("items", [])
            return artists[0] if artists else None
        except Exception as e:
            logger.error(f"Error searching for artist '{artist_name}': {e}")
            return None
        
    def get_popularity_score(self, artist_name: str) -> Optional[str]:
        result = self.search_artist(artist_name)
        if result:
            print(artist_name + " " + str(result["popularity"]))
            return result["popularity"]
        else:
            print("Artist not found: " + artist_name)
            return None

        

    def bulk_popularity(self, names: List[str]) -> Dict[str, Optional[int]]:
        results = {}
        total = len(names)

        for name in names:
            if name in name_cache or len(name) == 0:
                print("Cache Hit! : " + name)
                continue
            listeners = self.get_popularity_score(name)
            results[name] = listeners
            name_cache.add(name)
        
        return results
    
conn = sqlite3.connect('C:\\forkle2\\PitchforkData\\database.sqlite')
cursor = conn.cursor()

def read_data(batch_size, offset):
    cursor.execute(f'SELECT * FROM artists LIMIT {batch_size} OFFSET {offset}')
    batch = cursor.fetchall()
    return batch

def get_artists(batch):
    lst = []
    for pair in batch:
        lst.append(pair[1])
    return lst


def main():
    # You need to add your Spotify API credentials here
   

    print("Starting Spotify API test...")
    spotify = SpotifyAPI(client_id, client_secret, requests_per_sec=0.8)
    artist_name = "RadioHead"
    print(f"Searching for artist: {artist_name}")
    more_data = True
    batch_size = 25
    offset = 3500
    while more_data:
        batch = read_data(batch_size, offset)
        artist_list = get_artists(batch)
        result = spotify.bulk_popularity(artist_list)
        print(result)
        with open('scores.csv', 'a', newline='') as csvfile:
            writer = csv.writer(csvfile)
            
            for artist, score in result.items():
                writer.writerow([artist, score])
        
        with open("offsets.txt", 'a') as file:
            file.write(str(offset))
        if len(batch) < batch_size:
            more_data = False
        offset += batch_size



# Fixed the condition to correctly run the main function
if __name__ == "__main__":
    main()