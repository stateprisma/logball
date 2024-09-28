export type ConfigFile = {
	version: string;
	prefilter: RegExp;
	filters?: LogFilter[];
	stylings?: Styling[];
};

export type LogFilter = {
	category: string;
	pattern: RegExp;
};

export type Styling = {
	category: string;
	text: string | null;
	bold: boolean;
	italic: boolean;
	color: string;
};
