# Logging Middleware

This folder contains the custom logging middleware for the URL Shortener microservice.

## Usage
- The middleware attaches a `req.log(level, package, message)` function to every request.
- It sends logs to the evaluation log API with the required fields and authorization.

## Example
```js
await req.log('info', 'route', 'Short URL created successfully');
```

## File
- `logger.js`: The middleware implementation.
