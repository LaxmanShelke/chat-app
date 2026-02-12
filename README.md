# Chat App

## Prerequisites
- Node.js
- MongoDB (running on default port 27017)

## Setup
1.  **Backend**:
    ```bash
    cd server
    npm install
    # Ensure MongoDB is running
    npm start
    ```
2.  **Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    ```

## Usage
- Open `http://localhost:5173` in multiple tabs/browsers.
- Enter a username and the *same* room connection ID (e.g., "general") to chat.
