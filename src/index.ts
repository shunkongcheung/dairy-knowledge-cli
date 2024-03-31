import { program } from "commander";
import { getDairyDescription, printDescription } from "./getDairyDescription";
import { getFileInfos } from "./getFileInfos";
import { getTopics } from "./getTopics";
import { ITopic } from "./types";

interface IOptions {
	tags: string;
	topics: string;
	fromDate: Date | null;
	endDate: Date | null;
}
const getOptionResult = (options: IOptions) => {
	const tags = options.tags ? options.tags.split(",") : [];
	const topics = options.topics ? options.topics.split(",") : [];
	const fromDate = options.fromDate ? new Date(options.fromDate) : null;
	const endDate = options.endDate ? new Date(options.endDate) : null;

	return { tags, topics, fromDate, endDate  }
}


(async () => {

	program
	.name("dairy-knowledge cli")
	.description("A CLI to help me understand my schedule, spending, and more")
	.version("1.0.0");

	program
	.command("check")
	.description("check file(s) to see if it comply with the rules of this application")
	.argument("<filename>", "full file name. Or a directory name.")
	.option("-a --tags <tags>", "Filter by topics")
	.option("-e --endDate <endDate>", "End date")
	.option("-f --fromDate <fromDate>", "From date")
	.option("-o --topics <topics>", "Filter by topics")
	.action(async (filename: string, options: IOptions) => {
		const fileInfos = await getFileInfos(filename);

		const result = getOptionResult(options);

		fileInfos
			.filter(({ date }) => {
				const isAfterFromDate = !result.fromDate  ||  date >= result.fromDate;
				const isBeforeFromDate = !result.endDate  ||  date <= result.endDate;
				return isAfterFromDate && isBeforeFromDate;
			})
			.map(({ filename, fileContent}) => {
				let topics: ITopic[] = [];
				try {
					topics = getTopics(fileContent);
				}catch (err) {
					console.log(`Below error happens at: ${filename}`);
					throw Error(err);
				}
				return { filename, topics };
			})
			.filter(({ topics }) => 
				result.topics.length === 0 || result.topics
				.map(resultTopic => resultTopic.toLowerCase())
				.some(resultTopic => topics.some(topic => topic.title.toLowerCase().includes(resultTopic)))
			)
			.filter(({ topics }) => {
				const allTags = topics.reduce((tags, topic) => [...tags, ...topic.tags], []);
				return result.tags.length === 0 || result.tags
				.map(resultTag => resultTag.toLowerCase())
				.some(resultTag => allTags.some(tag => tag.text.toLowerCase().includes(resultTag)))
			})
			.map(getDairyDescription)
			.forEach(printDescription);
	});

	program.parse();

})();
