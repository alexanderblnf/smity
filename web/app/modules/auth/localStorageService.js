'use strict';

angular
.module('auth')
.service('LocalStorage', ['$window', LocalStorage]);

function LocalStorage($window) {
	var storage = $window.localStorage;

	return {
		get: get,
		put: put,
		remove: remove,
		clear: clear
	};

	function get(key) {
		return storage.getItem(key);
	}

	function put(key, value) {
		return storage.setItem(key, value);
	}

	function remove(key) {
		return storage.removeItem(key);
	}

	function clear() {
		return storage.clear();
	}
}