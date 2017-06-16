'use strict';

angular
	.module('urad', ['moment-picker'])
	.config(['momentPickerProvider', function (momentPickerProvider) {
		momentPickerProvider.options({
			/* Picker properties */
			locale: 'ro',
			format: 'L LT',
			minView: 'decade',
			maxView: 'minute',
			startView: 'year',
			autoclose: true,
			today: false,
			keyboard: false,

			/* Extra: Views properties */
			leftArrow: '&larr;',
			rightArrow: '&rarr;',
			yearsFormat: 'YYYY',
			monthsFormat: 'MMM',
			daysFormat: 'D',
			hoursFormat: 'HH',
			minutesFormat: 'mm',
			minutesStep: 1
		});
	}]);