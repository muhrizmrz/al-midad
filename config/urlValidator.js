const url = require('url');
const xss = require('xss');

function validateUrl(inputUrl) {
    try {
        const parsedUrl = new URL(inputUrl);
        return true; // URL is valid
    } catch (error) {
        return false; // URL is not valid
    }
}

function sanitizeUrl(inputUrl) {
    // Remove potentially dangerous HTML and JavaScript from the URL
    return xss(inputUrl);
}

function validateAndSanitizeUrl(inputUrl) {
    if (validateUrl(inputUrl)) {
        return sanitizeUrl(inputUrl);
    }
    return null; // Invalid URL
}

module.exports = validateAndSanitizeUrl
