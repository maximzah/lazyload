import { setSources } from "./lazyload.setSources";
import {
	setTimeoutData,
	getTimeoutData,
	getWasProcessedData,
	setWasProcessedData
} from "./lazyload.data";
import { addOneShotEventListeners } from "./lazyload.event";
import { addClass } from "./lazyload.class";
import { callbackIfSet } from "./lazyload.callback";

const managedTags = ["IMG", "IFRAME", "VIDEO"];

export const loadAndUnobserve = (element, observer, settings) => {
	revealElement(element, settings);
	observer.unobserve(element);
};

export const cancelDelayLoad = element => {
	var timeoutId = getTimeoutData(element);
	if (!timeoutId) {
		return; // do nothing if timeout doesn't exist
	}
	clearTimeout(timeoutId);
	setTimeoutData(element, null);
};

export const delayLoad = (element, observer, settings) => {
	var loadDelay = settings.load_delay;
	var timeoutId = getTimeoutData(element);
	if (timeoutId) {
		return; // do nothing if timeout already set
	}
	timeoutId = setTimeout(function() {
		loadAndUnobserve(element, observer, settings);
		cancelDelayLoad(element);
	}, loadDelay);
	setTimeoutData(element, timeoutId);
};

export function revealElement(element, settings, force) {
	if (!force && getWasProcessedData(element)) {
		return; // element has already been processed and force wasn't true
	}
	callbackIfSet(settings.callback_enter, element);
	if (managedTags.indexOf(element.tagName) > -1) {
		addOneShotEventListeners(element, settings);
		addClass(element, settings.class_loading);
	}
	setSources(element, settings);
	setWasProcessedData(element);
	callbackIfSet(settings.callback_set, element);
}
