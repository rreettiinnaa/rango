import browser from "webextension-polyfill";
import { initOptions } from "../lib/options";
import {
	increaseHintSize,
	decreaseHintSize,
	toggleHints,
} from "./options-utils";
import { clickElement } from "./click-element";
import { copyLink, showLink } from "./links";
import { hoverElement, unhoverAll } from "./hover";
import { displayHints } from "./hints";
import observe from "./observers";

observe();

// Initialize options
initOptions().catch((error) => {
	console.error(error);
});

browser.runtime.onMessage.addListener(async (request) => {
	if (request.action.type === "clickElement") {
		await clickElement(request.action.target, false, {
			bubbles: true,
			cancelable: true,
			view: window,
		});
	}

	if (request.action.type === "copyLink") {
		const url = copyLink(request.action.target);
		if (url) {
			return {
				type: "response",
				action: {
					type: "copyLink",
					target: url,
				},
			};
		}
	}

	if (request.action.type === "showLink") {
		showLink(request.action.target);
	}

	if (request.action.type === "openInNewTab") {
		await clickElement(request.action.target, true);
	}

	if (request.action.type === "hoverElement") {
		await hoverElement(request.action.target, false);
	}

	if (request.action.type === "fixedHoverElement") {
		await hoverElement(request.action.target, true);
	}

	if (request.action.type === "unhoverAll") {
		unhoverAll();
	}

	if (request.action.type === "toggleHints") {
		await toggleHints();
	}

	if (request.action.type === "increaseHintSize") {
		await increaseHintSize();
	}

	if (request.action.type === "decreaseHintSize") {
		await decreaseHintSize();
	}

	return { type: "response", action: { type: "ok" } };
});

document.addEventListener("scroll", async () => {
	await displayHints();
});

window.addEventListener("resize", async () => {
	await displayHints();
});
