# Overview

The Fetch Metadata API provides a simple endpoint to retrieve metadata (title, description, and image) from a list of provided URLs. This can be useful for applications that need to display link previews, gather information about web pages, or analyze web content.The Fetch Metadata API provides a simple endpoint to retrieve metadata (title, description, and image) from a list of provided URLs. This can be useful for applications that need to display link previews, gather information about web pages, or analyze web content.

# Base URL
http://localhost:{PORT} 

* Remote url deppend on your hosting service.

# Endpoint
1. POST /fetch-metadata
This endpoint accepts a list of URLs and returns their corresponding metadata, including the page title, description, and the Open Graph image (if available).

Request
Method: POST
URL: /fetch-metadata
Content-Type: application/json
Request Body

{
  "urls": [
    "https://example.com",
    "https://another-example.com"
  ]
}

urls: Required. An array of strings, where each string is a valid URL.
Response
Content-Type: application/json
Success Response (200 OK)
If the request is successful, the server responds with a JSON array containing metadata objects for each URL.

[
  {
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "This domain is for use in illustrative examples in documents.",
    "image": "https://example.com/image.png"
  },
  {
    "url": "https://another-example.com",
    "title": "Another Example Domain",
    "description": "This is another example domain.",
    "image": ""
  }
]

Each metadata object contains:

url: The original URL.
title: The title of the web page.
description: The meta description of the web page.
image: The URL of the Open Graph image (if available).
Error Response (400 Bad Request)
If the request body is missing or incorrectly formatted, the server responds with an error message.


Error Response (400 Bad Request)
If the request body is missing or incorrectly formatted, the server responds with an error message.

{
  "error": "Please provide an array of URLs"
}

Error Response (429 Too Many Requests)
If the request rate exceeds the limit (e.g., more than 5 requests per second), the server responds with an error message.

{
  "error": "Too many requests, please try again later."
}


# Rate Limiting

The API is rate-limited to 5 requests per second per IP address to prevent abus

# Security

CSRF Protection: The API is protected against Cross-Site Request Forgery (CSRF) attacks using tokens.
XSS Protection: Proper input sanitization is performed to prevent Cross-Site Scripting (XSS) attacks.
Content Security Policy (CSP): The API uses a strong CSP to prevent the execution of malicious scripts.

# Example cURL Request

curl -X POST http://localhost:3000/fetch-metadata \
-H "Content-Type: application/json" \
-d '{"urls": ["https://example.com", "https://another-example.com"]}'

