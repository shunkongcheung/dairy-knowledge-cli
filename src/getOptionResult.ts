import { Command } from "commander";

export interface IOptions {
	isSpendingOnly: boolean;
	isTodoOnly: boolean;
	tags: string[];
	topics: string[];
	fromDate: Date | null;
	endDate: Date | null;
}

export const appendOptions = (command: Command) => {
	command
	.argument("<filename>", "full file name. Or a directory name.")
	.option("-a --tags <tags>", "Filter by topics")
	.option("-e --endDate <endDate>", "End date")
	.option("-f --fromDate <fromDate>", "From date")
	.option("-o --topics <topics>", "Filter by topics")
	.option("-s --isSpendingOnly", "Print dairy with todo list only")
	.option("-t --isTodoOnly", "Print dairy with spending list only")

	return command;
}

export const getOptionResult = (options: { [x: string]: string }): IOptions => {
	const tags = options.tags ? options.tags.split(",") : [];
	const topics = options.topics ? options.topics.split(",") : [];
	const fromDate = options.fromDate ? new Date(options.fromDate) : null;
	const endDate = options.endDate ? new Date(options.endDate) : null;

	const isSpendingOnly = !!options.isSpendingOnly;
	const isTodoOnly = !!options.isTodoOnly;

	return { isSpendingOnly, isTodoOnly, tags, topics, fromDate, endDate  }
}


