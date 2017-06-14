'use strict';

angular.module('smity')
    .service('SharedVariables', [SharedVariables]);

function SharedVariables() {
	var mapType = false;
    var param = '';
    var preferences = [];
    var measureUnits = {
        temperature: '°C',
        pressure: 'Pa',
        humidity: '%',
        co2: 'ppm',
        pm25: 'µg/m3',
        ch2o: 'ppm',
        cpm: 'µSv/h',
        voc: ''
    };

	var names = {
		temperature: 'Temperatura',
		pressure: 'Presiune',
		humidity: 'Umiditate',
		co2: 'Dioxid de carbon',
		pm25: 'Particule de praf',
		ch2o: 'Formaldehida',
		cpm: 'Radiatii',
		voc: 'Compusi organici volatili'
	};

    return {
        getMapType: getMapType,
        setMapType: setMapType,
        getParam: getParam,
        setParam: setParam,
        getMeasureUnits: getMeasureUnits,
        getPreferences: getPreferences,
	    setPreferences: setPreferences,
	    getNames: getNames,
	    setNames: setNames
    };

    function setMapType() {
        mapType = !mapType;
    }

    function getMapType() {
        return mapType;
    }

    function getParam() {
        return param;
    }

    function setParam(value) {
        param = value;
    }

    function getMeasureUnits() {
        return measureUnits;
    }

    function getPreferences() {
        return preferences;
    }

    function setPreferences(value) {
        preferences = value;
    }

	function getNames() {
		return names;
	}

	function setNames(value) {
		names = value;
    }
}