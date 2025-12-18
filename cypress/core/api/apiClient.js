const axios = require('axios');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');

/**
 * ApiClient - A fluent API client for making HTTP requests with various authentication methods
 * Mirrors the functionality of the .NET RestSharp ApiClient implementation
 */
class ApiClient {
    /**
     * Creates an instance of ApiClient
     * @param {string|object} urlOrClient - Base URL string or axios instance
     */
    constructor(urlOrClient) {
        if (typeof urlOrClient === 'string') {
            this._baseUrl = urlOrClient;
            this._client = axios.create({
                baseURL: urlOrClient,
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else if (urlOrClient && typeof urlOrClient === 'object') {
            this._client = urlOrClient;
            this._baseUrl = urlOrClient.defaults?.baseURL || '';
        } else {
            throw new Error('Constructor requires a URL string or axios instance');
        }
        
        this.request = {
            url: '',
            method: 'GET',
            headers: {},
            params: {},
            data: null,
            auth: null
        };
    }

    /**
     * Creates a new ApiClient instance with the same base URL but new configuration
     * @param {object} config - Axios configuration options
     * @returns {ApiClient} New ApiClient instance
     */
    _createNewInstance(config = {}) {
        const newClient = axios.create({
            baseURL: this._baseUrl,
            timeout: 30000,
            ...config
        });
        return new ApiClient(newClient);
    }

    /**
     * Sets Basic Authentication (username and password)
     * @param {string} username - Username for basic auth
     * @param {string} password - Password for basic auth
     * @returns {ApiClient} New ApiClient instance with basic auth configured
     */
    setBasicAuthentication(username, password) {
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        return this._createNewInstance({
            headers: {
                'Authorization': `Basic ${token}`
            }
        });
    }

    /**
     * Sets OAuth 1.0 Request Token Authentication
     * @param {string} consumerKey - OAuth consumer key
     * @param {string} consumerSecret - OAuth consumer secret
     * @returns {ApiClient} New ApiClient instance with OAuth1 request token auth
     */
    setRequestTokenAuthentication(consumerKey, consumerSecret) {
        const newInstance = this._createNewInstance();
        newInstance._oauth1Config = {
            consumerKey,
            consumerSecret,
            type: 'request'
        };
        return newInstance;
    }

    /**
     * Sets OAuth 1.0 Access Token Authentication
     * @param {string} consumerKey - OAuth consumer key
     * @param {string} consumerSecret - OAuth consumer secret
     * @param {string} oauthToken - OAuth token
     * @param {string} oauthTokenSecret - OAuth token secret
     * @returns {ApiClient} New ApiClient instance with OAuth1 access token auth
     */
    setAccessTokenAuthentication(consumerKey, consumerSecret, oauthToken, oauthTokenSecret) {
        const newInstance = this._createNewInstance();
        newInstance._oauth1Config = {
            consumerKey,
            consumerSecret,
            oauthToken,
            oauthTokenSecret,
            type: 'access'
        };
        return newInstance;
    }

    /**
     * Sets Bearer token authentication in request header
     * @param {string} token - Authentication token
     * @param {string} authType - Authentication type (default: 'Bearer')
     * @returns {ApiClient} New ApiClient instance with header auth configured
     */
    setRequestHeaderAuthentication(token, authType = 'Bearer') {
        return this._createNewInstance({
            headers: {
                'Authorization': `${authType} ${token}`
            }
        });
    }

    /**
     * Sets JWT token authentication
     * @param {string} token - JWT token
     * @returns {ApiClient} New ApiClient instance with JWT auth configured
     */
    setJwtAuthentication(token) {
        return this.setRequestHeaderAuthentication(token, 'Bearer');
    }

    /**
     * Clears any authentication configuration
     * @returns {ApiClient} New ApiClient instance without authentication
     */
    clearAuthenticator() {
        return this._createNewInstance();
    }

    /**
     * Adds default headers to all requests
     * @param {object} headers - Object containing header key-value pairs
     * @returns {ApiClient} Current instance for chaining
     */
    addDefaultHeaders(headers) {
        Object.assign(this._client.defaults.headers.common, headers);
        return this;
    }

    /**
     * Creates a new request with optional endpoint
     * @param {string} endpoint - API endpoint path
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
     * @returns {ApiClient} Current instance for chaining
     */
    createRequest(endpoint = '', method = 'GET') {
        this.request = {
            url: endpoint,
            method: method.toUpperCase(),
            headers: {},
            params: {},
            data: null,
            auth: null
        };
        return this;
    }

    /**
     * Adds a header to the current request
     * @param {string} key - Header name
     * @param {string} value - Header value
     * @returns {ApiClient} Current instance for chaining
     */
    addHeader(key, value) {
        this.request.headers[key] = value;
        return this;
    }

    /**
     * Adds a query parameter to the current request
     * @param {string} key - Parameter name
     * @param {string} value - Parameter value
     * @returns {ApiClient} Current instance for chaining
     */
    addQueryParameter(key, value) {
        this.request.params[key] = value;
        return this;
    }

    /**
     * Adds Authorization header
     * @param {string} value - Authorization value
     * @returns {ApiClient} Current instance for chaining
     */
    addAuthorizationHeader(value) {
        return this.addHeader('Authorization', value);
    }

    /**
     * Adds Content-Type header
     * @param {string} value - Content-Type value
     * @returns {ApiClient} Current instance for chaining
     */
    addContentTypeHeader(value) {
        return this.addHeader('Content-Type', value);
    }

    /**
     * Adds a parameter to the request body (form data)
     * @param {string} key - Parameter name
     * @param {string} value - Parameter value
     * @returns {ApiClient} Current instance for chaining
     */
    addParameter(key, value) {
        if (!this.request.data) {
            this.request.data = {};
        }
        if (typeof this.request.data === 'object' && !Array.isArray(this.request.data)) {
            this.request.data[key] = value;
        }
        return this;
    }

    /**
     * Adds a body to the request
     * @param {object|string} body - Request body
     * @param {string} contentType - Content-Type (optional, defaults to application/json)
     * @returns {ApiClient} Current instance for chaining
     */
    addBody(body, contentType = 'application/json') {
        if (typeof body === 'object') {
            this.request.data = body;
        } else if (typeof body === 'string') {
            this.request.data = body;
        } else {
            this.request.data = JSON.stringify(body);
        }
        
        if (contentType) {
            this.addHeader('Content-Type', contentType);
        }
        return this;
    }

    /**
     * Generates OAuth 1.0 signature
     * @param {string} method - HTTP method
     * @param {string} url - Full URL
     * @param {object} params - OAuth parameters
     * @returns {string} OAuth signature
     */
    _generateOAuth1Signature(method, url, params) {
        const { consumerSecret, oauthTokenSecret = '' } = this._oauth1Config;
        
        // Sort parameters
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        
        // Create signature base string
        const signatureBaseString = [
            method.toUpperCase(),
            encodeURIComponent(url),
            encodeURIComponent(sortedParams)
        ].join('&');
        
        // Create signing key
        const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(oauthTokenSecret)}`;
        
        // Generate signature using HMAC-SHA1
        const signature = CryptoJS.HmacSHA1(signatureBaseString, signingKey);
        return CryptoJS.enc.Base64.stringify(signature);
    }

    /**
     * Applies OAuth 1.0 authentication to the request
     * @param {object} config - Axios request config
     * @returns {object} Modified config with OAuth headers
     */
    _applyOAuth1(config) {
        if (!this._oauth1Config) return config;

        const { consumerKey, oauthToken = '' } = this._oauth1Config;
        
        // Generate OAuth parameters
        const oauthParams = {
            oauth_consumer_key: consumerKey,
            oauth_nonce: crypto.randomBytes(16).toString('hex'),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
            oauth_version: '1.0'
        };
        
        if (oauthToken) {
            oauthParams.oauth_token = oauthToken;
        }
        
        // Build full URL for signature
        const fullUrl = `${this._baseUrl}${config.url}`.split('?')[0];
        
        // Merge query params with OAuth params for signature
        const allParams = { ...oauthParams, ...config.params };
        
        // Generate signature
        const signature = this._generateOAuth1Signature(config.method.toUpperCase(), fullUrl, allParams);
        oauthParams.oauth_signature = signature;
        
        // Build Authorization header
        const authHeader = 'OAuth ' + Object.keys(oauthParams)
            .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
            .join(', ');
        
        config.headers['Authorization'] = authHeader;
        return config;
    }

    /**
     * Executes the configured request
     * @returns {Promise<object>} Response object with data, status, headers, etc.
     */
    async executeAsync() {
        try {
            let config = {
                ...this.request,
                headers: {
                    ...this._client.defaults.headers.common,
                    ...this.request.headers
                }
            };
            
            // Apply OAuth 1.0 if configured
            if (this._oauth1Config) {
                config = this._applyOAuth1(config);
            }
            
            const response = await this._client.request(config);
            
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                config: response.config,
                request: response.request,
                isSuccessful: response.status >= 200 && response.status < 300
            };
        } catch (error) {
            if (error.response) {
                // Request made and server responded with error status
                return {
                    data: error.response.data,
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    config: error.response.config,
                    request: error.response.request,
                    isSuccessful: false,
                    error: error.message
                };
            } else {
                // Something else happened
                throw error;
            }
        }
    }

    /**
     * Executes GET request
     * @returns {Promise<object>} Response object
     */
    async executeGetAsync() {
        this.request.method = 'GET';
        return await this.executeAsync();
    }

    /**
     * Executes POST request
     * @returns {Promise<object>} Response object
     */
    async executePostAsync() {
        this.request.method = 'POST';
        return await this.executeAsync();
    }

    /**
     * Executes PUT request
     * @returns {Promise<object>} Response object
     */
    async executePutAsync() {
        this.request.method = 'PUT';
        return await this.executeAsync();
    }

    /**
     * Executes DELETE request
     * @returns {Promise<object>} Response object
     */
    async executeDeleteAsync() {
        this.request.method = 'DELETE';
        return await this.executeAsync();
    }

    /**
     * Executes PATCH request
     * @returns {Promise<object>} Response object
     */
    async executePatchAsync() {
        this.request.method = 'PATCH';
        return await this.executeAsync();
    }

    /**
     * Gets the underlying axios client instance
     * @returns {object} Axios client instance
     */
    getClient() {
        return this._client;
    }

    /**
     * Gets the current request configuration
     * @returns {object} Request configuration
     */
    getRequest() {
        return this.request;
    }

    /**
     * Gets the base URL
     * @returns {string} Base URL
     */
    getBaseUrl() {
        return this._baseUrl;
    }
}

module.exports = ApiClient;

