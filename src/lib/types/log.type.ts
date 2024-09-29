import type { Style } from './config.type';

export type Log = {
	raw: string;
	other?: Map<
		string,
		{
			text: string;
			index: number;
			style?: Style;
		}[]
	>;
};
