/**
 * Generic ApiClient using only cy.request
 * Can be used for any REST API - not specific to any service
 * No external libraries required - pure Cypress!
 */
class ApiClient {
  /**
   * Create a new ApiClient instance
   * @param {string} baseUrl - Base URL for the API (e.g., 'https://api.example.com')
   * @param {object} defaultHeaders - Default headers to include in all requests
   */
  constructor(baseUrl = '', defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
  }

  /**
   * Make a generic HTTP request
   * @param {object} options - Request options
   * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, PATCH)
   * @param {string} options.endpoint - API endpoint path
   * @param {object} options.body - Request body
   * @param {object} options.headers - Additional headers
   * @param {object} options.qs - Query string parameters
   * @param {boolean} options.failOnStatusCode - Fail on error status codes (default: true)
   * @returns {Cypress.Chainable} Cypress response
   */
  request(options) {
    const {
      method = 'GET',
      endpoint = '',
      body = null,
      headers = {},
      qs = {},
      failOnStatusCode = true,
      ...otherOptions
    } = options;

    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseUrl}${endpoint}`;

    return cy.request({
      method,
      url,
      body,
      headers: { ...this.defaultHeaders, ...headers },
      qs,
      failOnStatusCode,
      ...otherOptions
    });
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional options (headers, qs, etc.)
   * @returns {Cypress.Chainable} Cypress response
   */
  get(endpoint, options = {}) {
    return this.request({
      method: 'GET',
      endpoint,
      ...options
    });
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {object} options - Additional options (headers, qs, etc.)
   * @returns {Cypress.Chainable} Cypress response
   */
  post(endpoint, body, options = {}) {
    return this.request({
      method: 'POST',
      endpoint,
      body,
      ...options
    });
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {object} options - Additional options (headers, qs, etc.)
   * @returns {Cypress.Chainable} Cypress response
   */
  put(endpoint, body, options = {}) {
    return this.request({
      method: 'PUT',
      endpoint,
      body,
      ...options
    });
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body
   * @param {object} options - Additional options (headers, qs, etc.)
   * @returns {Cypress.Chainable} Cypress response
   */
  patch(endpoint, body, options = {}) {
    return this.request({
      method: 'PATCH',
      endpoint,
      body,
      ...options
    });
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional options (headers, body, qs, etc.)
   * @returns {Cypress.Chainable} Cypress response
   */
  delete(endpoint, options = {}) {
    return this.request({
      method: 'DELETE',
      endpoint,
      ...options
    });
  }

  /**
   * Set authorization header (Bearer token)
   * @param {string} token - Authorization token
   * @returns {ApiClient} Returns this for method chaining
   */
  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    return this;
  }

  /**
   * Set basic authentication
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {ApiClient} Returns this for method chaining
   */
  setBasicAuth(username, password) {
    const encoded = btoa(`${username}:${password}`);
    this.defaultHeaders['Authorization'] = `Basic ${encoded}`;
    return this;
  }

  /**
   * Set a custom header
   * @param {string} key - Header name
   * @param {string} value - Header value
   * @returns {ApiClient} Returns this for method chaining
   */
  setHeader(key, value) {
    this.defaultHeaders[key] = value;
    return this;
  }

  /**
   * Remove a header
   * @param {string} key - Header name to remove
   * @returns {ApiClient} Returns this for method chaining
   */
  removeHeader(key) {
    delete this.defaultHeaders[key];
    return this;
  }

  /**
   * Clear authorization header
   * @returns {ApiClient} Returns this for method chaining
   */
  clearAuth() {
    delete this.defaultHeaders['Authorization'];
    return this;
  }

  /**
   * Get current default headers
   * @returns {object} Current default headers
   */
  getHeaders() {
    return { ...this.defaultHeaders };
  }

  /**
   * Create a new instance with the same base URL but fresh headers
   * @returns {ApiClient} New ApiClient instance
   */
  clone() {
    return new ApiClient(this.baseUrl, { ...this.defaultHeaders });
  }

  /**
   * Helper: Extract response body
   * @param {object} response - Cypress response object
   * @returns {*} Response body
   */
  static getBody(response) {
    return response.body;
  }

  /**
   * Helper: Extract response status
   * @param {object} response - Cypress response object
   * @returns {number} Response status code
   */
  static getStatus(response) {
    return response.status;
  }

  /**
   * Helper: Check if response is successful (2xx status)
   * @param {object} response - Cypress response object
   * @returns {boolean} True if status is 2xx
   */
  static isSuccess(response) {
    return response.status >= 200 && response.status < 300;
  }
}

module.exports = ApiClient;
