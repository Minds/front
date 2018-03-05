import { Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Cookie } from '../cookie';

/**
 * API Class
 */
export class Client {

	base: string = '/';
	cookie: Cookie = new Cookie();

	static _(http: Http) {
		return new Client(http);
	}

	constructor(public http: Http) {
	}

	/**
	 * Return a GET request
	 */
	get(endpoint: string, data: Object = {}, options: Object = {}) {
		var self = this;
		endpoint += '?' + this.buildParams(data);
		return new Promise((resolve, reject) => {
			self.http.get(
				self.base + endpoint,
				this.buildOptions(options)
			)
				.subscribe(
				res => {
					var data = res.json();
					if (!data || data.status !== 'success')
						return reject(data);

					return resolve(data);
				},
				err => {
					if (!err.data()) {
						return reject(err);
					}
					if (err.status === 401 && err.json().loggedin === false) {
						window.location.href = '/login';
						return reject(err);
					}
					return reject(err);
				});
		});
	}

	/**
	 * Return a POST request
	 */
	post(endpoint: string, data: Object = {}, options: Object = {}) {
		var self = this;
		return new Promise((resolve, reject) => {
			self.http.post(
				self.base + endpoint,
				JSON.stringify(data),
				this.buildOptions(options)
			)
				.subscribe(
				res => {
					var data = res.json();
					if (!data || data.status !== 'success')
						return reject(data);

					return resolve(data);
				},
				err => {
					if (!err.json()) {
						return reject(err);
					}
					if (err.status === 401 && err.json().loggedin === false) {
						window.location.href = '/login';
						return reject(err);
					}
					if (err.status !== 200) {
						return reject(err.json());
					}
				});
		});
	}

	/**
	 * Return a PUT request
	 */
	put(endpoint: string, data: Object = {}, options: Object = {}) {
		var self = this;
		return new Promise((resolve, reject) => {
			self.http.put(
				self.base + endpoint,
				JSON.stringify(data),
				this.buildOptions(options)
			)
				.subscribe(
				res => {
					var data = res.json();
					if (!data || data.status !== 'success')
						return reject(data);

					return resolve(data);
				},
				err => {
					if (err.status === 401 && err.json().loggedin === false) {
						window.location.href = '/login';
						return reject(err);
					}
					if (err.status !== 200) {
						return reject(err.json());
					}
				});
		});
	}

	/**
	 * Return a DELETE request
	 */
	delete(endpoint: string, data: Object = {}, options: Object = {}) {
		var self = this;
		return new Promise((resolve, reject) => {
			self.http.delete(
				self.base + endpoint,
				this.buildOptions(options)
			)
				.subscribe(
				res => {
					var data = res.json();
					if (!data || data.status !== 'success')
						return reject(data);

					return resolve(data);
				},
				err => {
					if (err.status === 401 && err.json().loggedin === false) {
						window.location.href = '/login';
						return reject(err);
					}
					if (err.status !== 200) {
						return reject(err.json());
					}
				});
		});
	}

	private buildParams(object: Object) {
		return Object.keys(object).map((k) => {
			return encodeURIComponent(k) + '=' + encodeURIComponent(object[k]);
		}).join('&');
	}

	/**
	 * Build the options
	 */
	private buildOptions(options: Object) {
		var XSRF_TOKEN = this.cookie.get('XSRF-TOKEN');
		var headers = new Headers();
		headers.append('X-XSRF-TOKEN', XSRF_TOKEN);
		var Objecti: any = Object;
		return Objecti.assign(options, {
			headers: headers,
			cache: true
		});
	}

}
