export interface IOptions {
	tags: string;
	topics: string;
	fromDate: string | null;
	endDate: string | null;
}

export const getOptionResult = (options: IOptions) => {
	const tags = options.tags ? options.tags.split(",") : [];
	const topics = options.topics ? options.topics.split(",") : [];
	const fromDate = options.fromDate ? new Date(options.fromDate) : null;
	const endDate = options.endDate ? new Date(options.endDate) : null;

	return { tags, topics, fromDate, endDate  }
}


