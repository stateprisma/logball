export type ConfigFile = {
	version: string;
	prefilter: RegExp;
	splitters?: LogSplitter[];
};

export type LogSplitter = {
	category: string;
	pattern: RegExp;
	styles: Style[];
};

export type Style = {
	pattern: RegExp;
	bold?: boolean;
	italic?: boolean;
	color?: string;
};
