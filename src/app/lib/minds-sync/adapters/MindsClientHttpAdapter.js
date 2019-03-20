export default class MindsClientHttpAdapter {
  /**
   * @param {Client} http
   */
  constructor(http) {
    this.http = http;
  }

  /**
   * @param {string} endpoint
   * @param {Object.<string, string>} data
   * @param {boolean} cache
   * @returns {Promise<Object>}
   */
  async get(endpoint, data = {}, cache = true) {
    try {
      const response = await this.http.get(endpoint, data, { cache });

      if (!response || response.status !== 'success') {
        throw new Error('Invalid response');
      }

      return response;
    } catch (e) {
      throw e;
    }
  }
}
