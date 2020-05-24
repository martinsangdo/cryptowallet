/**
 * author: Martin SD
 * utility functions
 */
import {C_Const} from '../constant';
import Utils from "../functions";
import {API_URI} from '../api_uri';

/**
 * send Post Request with default header
 * @param urlString
 * @param params
 * @param callback
 */
exports.sentPostRequest = function (urlString, params, callback) {
		this.sentPostRequestWithHeader(urlString, null, params, callback);
};

exports.sentPostRequestWithExtraHeaders = function (urlString, extra_headers, params, callback) {
	var headers = API_URI.DEFAULT_REQUEST_HEADER;
	if (!Utils.isEmpty(extra_headers)){
		Object.keys(extra_headers).forEach(function(key) {
				headers[key] = extra_headers[key];
		});
	}
	// Utils.dlog(headers);
	this.sentPostRequestWithHeader(urlString, headers, params, callback);
};

exports.sentPutRequestWithExtraHeaders = function (urlString, extra_headers, params, callback) {
	var headers = API_URI.DEFAULT_REQUEST_HEADER;
	if (!Utils.isEmpty(extra_headers)){
		Object.keys(extra_headers).forEach(function(key) {
				headers[key] = extra_headers[key];
		});
	}
	// Utils.dlog(headers);
	this.sentPutRequestWithHeader(urlString, headers, params, callback);
};
exports.sentPostRequestWithHeader = function (urlString, headers, params, callback) {
		if (Utils.isEmpty(headers)) {
				headers = API_URI.DEFAULT_REQUEST_HEADER;
		}
		var options = {
				method: 'POST',
				headers: headers
		};
		if (!Utils.isEmpty(params)){
			options['body'] = JSON.stringify(params);
		}
		// console.log(options);
		fetch(urlString, options).then((response) => {
			// console.log(response);
			return response.json()}
		)
				.then((responseJson) => {
					// console.log(responseJson);
					callback(responseJson, null);
				})
				.catch((error) => {
					// console.log('error', error);
					callback(null, error);
				});
};


exports.sentPutRequestWithHeader = function (urlString, headers, params, callback) {
		if (Utils.isEmpty(headers)) {
				headers = API_URI.DEFAULT_REQUEST_HEADER;
		}
		// console.log(headers);
		fetch(urlString, {
				method: 'PUT',
				headers: headers,
				body: JSON.stringify(params)
		}).then((response) => {
			// console.log(response);
			return response.json()}
		)
				.then((responseJson) => {
					// console.log(responseJson);
					callback(responseJson, null);
				})
				.catch((error) => {
					// console.log('error', error);
					callback(null, error);
				});
};

exports.sentGetRequest = function (urlString, callback) {
		this.sentGetRequestWithHeader(urlString, null, callback);
};

exports.sentGetRequestWithExtraHeaders = function (urlString, extra_headers, callback) {
	var headers = API_URI.DEFAULT_REQUEST_HEADER;
	if (!Utils.isEmpty(extra_headers)){
		Object.keys(extra_headers).forEach(function(key) {
				headers[key] = extra_headers[key];
		});
	}
	this.sentGetRequestWithHeader(urlString, headers, callback);
};

exports.sentGetRequestWithHeader = function (urlString, headers, callback) {
		if (Utils.isEmpty(headers)) {
				headers = API_URI.DEFAULT_REQUEST_HEADER;
		}
		// console.log(headers);
		fetch(urlString, {
				method: 'GET',
				headers: headers
		}).then((response) => {
			// console.log(response);
			return response.json()}
		)
				.then((responseJson) => {
						callback(responseJson, null);
				})
				.catch((error) => {
						callback(null, error);
				});
};
//raw response, not json
exports.sentPlainGetRequest = function (urlString, callback) {
		fetch(urlString, {
				method: 'GET'
		}).then((response) => {
			return response;
    }).then((response) => {
      if (response['ok'] && response['status'] == 200){
        callback(response['_bodyText'], null);
      } else {
        callback(null, "Invalid repsonse");
      }
		}).catch((error) => {
			callback(null, error);
		});
};
