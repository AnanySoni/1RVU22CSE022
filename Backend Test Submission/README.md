# Backend Test Submission

This folder contains the complete source code for the URL Shortener microservice.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### 1. Create Short URL
- **POST** `/shorturls`
- **Body:**
  ```json
  {
    "url": "https://example.com/very-long-url",
    "validity": 30,
    "shortcode": "abcd1"
  }
  ```
- **Response:**
  ```json
  {
    "shortLink": "http://localhost:3000/abcd1",
    "expiry": "2025-01-01T00:30:00Z"
  }
  ```

### 2. Redirect Short URL
- **GET** `/:shortcode`
- **Response:** Redirects to the original URL.

### 3. Retrieve Short URL Statistics
- **GET** `/shorturls/:shortcode`
- **Response:**
  ```json
  {
    "totalClicks": 2,
    "url": "https://example.com/very-long-url",
    "createdAt": "2025-01-01T00:00:00Z",
    "expiry": "2025-01-01T00:30:00Z",
    "clicks": [
      {
        "timestamp": "2025-01-01T00:05:00Z",
        "referrer": "",
        "ip": "127.0.0.1"
      }
    ]
  }
  ```

## Error Handling
- Returns appropriate status codes and descriptive error messages for invalid input, expired links, collisions, etc.

## Logging
- All significant events are logged using the custom middleware.
