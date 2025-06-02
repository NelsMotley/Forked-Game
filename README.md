# Forkle

## Overview
Forkle is a web game built with React JS and Flask where the goal is to correctly guess the review scores given to albums by the music publication Pitchfork. The albums are presented in 3 rounds with difficultly increasing each round. The interface is design to look like a record player and also behaves like one as the users enters more correct answers. The design is adaptive to mobile devices and will be improved upon in future releases.
This project uses React for the frontend and Flask for the backend API.

## Technologies
- **Frontend**: React
- **Backend**: Flask
- **Database**: Sqlite database

## Prerequisites
- Node.js (v22.13.0 or later) has not been tested with older versions
- npm (v10.9.2 or later)
- Python (v3.13.1 or later)
- pip (latest version)

## Project Structure
```
project-root/
├── React-Front/        # React frontend
│   ├── public/         # Public assets
│   ├── src/            # Source files
│   └──  package.json   # npm dependencies
├── Backend/            # Flask backend
│   ├── Server2.py/     # Application code
│   ├── PitchforkData/  # Database
│   └── requirements.txt# Python dependencies
└── README.md           # This file
```

## Installation

### Backend Setup
1. Create and activate a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd React-Front
   npm install 
   ```

## Running the Application

### Backend
1. Activate the virtual environment if not already active:
   ```Bash
   cd Backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Start the Flask server:
   ```bash
   python Server2.py
   ```
   The API will be available at http://localhost:5000

### Frontend
1. Start the React development server:
   ```bash
   cd React-Front
   npm start
   ```
   The application will be available at http://localhost:3000

## API Documentation
Describe your API endpoints here, or link to more detailed documentation.

Example:
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/review` | GET | Returns the reviews used to generate a question |
| `/check-db` | GET | Check that the database is working |
| `/check-bank` | GET | Check that the servers question bank is full |


## Environment Variables

### Backend
- `DATABASE_PATH`: Path to the database

### Frontend
- `REACT_APP_API_URL`: URL of the backend API

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Acknowledgements
Nolan Conaway. (Sunday, Jan 8 2016). 18,393 Pitchfork Reviews, Version 1. Retrieved 3/22/2025 from https://www.kaggle.com/datasets/nolanbconaway/pitchfork-data/data
