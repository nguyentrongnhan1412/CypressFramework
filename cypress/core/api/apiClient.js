class ApiClient {
  constructor(baseUrl = '', defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
  }

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

  get(endpoint, options = {}) {
    return this.request({
      method: 'GET',
      endpoint,
      ...options
    });
  }

  post(endpoint, body, options = {}) {
    return this.request({
      method: 'POST',
      endpoint,
      body,
      ...options
    });
  }

  put(endpoint, body, options = {}) {
    return this.request({
      method: 'PUT',
      endpoint,
      body,
      ...options
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request({
      method: 'PATCH',
      endpoint,
      body,
      ...options
    });
  }

  delete(endpoint, options = {}) {
    return this.request({
      method: 'DELETE',
      endpoint,
      ...options
    });
  }

  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    return this;
  }

  setBasicAuth(username, password) {
    const encoded = btoa(`${username}:${password}`);
    this.defaultHeaders['Authorization'] = `Basic ${encoded}`;
    return this;
  }

  setHeader(key, value) {
    this.defaultHeaders[key] = value;
    return this;
  }

  removeHeader(key) {
    delete this.defaultHeaders[key];
    return this;
  }

  clearAuth() {
    delete this.defaultHeaders['Authorization'];
    return this;
  }

  getHeaders() {
    return { ...this.defaultHeaders };
  }

  clone() {
    return new ApiClient(this.baseUrl, { ...this.defaultHeaders });
  }

  static getBody(response) {
    return response.body;
  }

  static getStatus(response) {
    return response.status;
  }

  static isSuccess(response) {
    return response.status >= 200 && response.status < 300;
  }
}

module.exports = ApiClient;
