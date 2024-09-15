export type ConfigFile = {
	version: string;
    prefilter: RegExp;
	filters: LogFilter[];
};

export type LogFilter = {
	name: string;
	color: string;
	pattern: RegExp;
};
