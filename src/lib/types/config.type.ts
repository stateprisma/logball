export type ConfigFile = {
	version: string;
	prefilter: RegExp;
	filters: {
		level: LevelLogFilter[];
		module: ModuleLogFilter[];
	};
};

export type LogFilter = {
	pattern: RegExp;
};

export type LevelLogFilter = {
	name: string;
	color: string;
} & LogFilter;

export type ModuleLogFilter = {
	module: string;
} & LogFilter;
