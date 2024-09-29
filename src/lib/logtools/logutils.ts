import { configStore } from '$lib/stores/config';
import type { Style } from '$lib/types/config.type';
import type { Log } from '$lib/types/log.type';
import { get } from 'svelte/store';

export function strToLog(log: string): Log {
	let fLog: Log = { raw: log };
	get(configStore).splitters?.forEach((splitter) => {
		let match: RegExpExecArray | null;
		while ((match = splitter.pattern.exec(log)) !== null) {
			if (match[0]) {
				if (fLog.other === undefined) {
					fLog.other = new Map();
				}

				if (!fLog.other.has(splitter.category)) {
					fLog.other.set(splitter.category, []);
				}

				fLog.other.get(splitter.category)?.push({
					text: match[0],
					index: match.index,
					style:
						splitter.styles.find((s) => {
							return s.pattern.test((match as RegExpExecArray)[0]);
						}) || undefined
				});
			}
		}
	});

	return fLog;
}

export function formatLog(log: Log): string {
	let text = log.raw;
	log.other?.forEach((matches) => {
		matches.forEach((match) => {
			text = text.replace(match.text, getStyle(match.text, match.style));
		});
	});

	return text;
}

function getStyle(text: string, style?: Style): string {
	if (style === undefined) {
		return text;
	}

	let fText = text;
	if (style.bold === true) {
		fText = `<b>${fText}</b>`;
	}
	if (style.italic === true) {
		fText = `<i>${fText}</b>`;
	}
	if (style.color !== undefined) {
		fText = `<span style="color: ${style.color};">${fText}</span>`;
	}

	return fText;
}
