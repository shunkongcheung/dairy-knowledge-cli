import { getDairyDescription, printDescription } from "./getDairyDescription";
import { getFileInfos } from "./getFileInfos";
import { getOptionResult, IOptions } from "./getOptionResult";
import { getTopics } from "./getTopics";
import { ITopic } from "./types";

const getInTargets = (targets: string[], text: string) => targets.some(target => text.toLowerCase().includes(target));
	

export const check = async (filename: string, options: IOptions) => {
		const fileInfos = await getFileInfos(filename);

		const result = getOptionResult(options);

		fileInfos
			.filter(({ date }) => {
				const isAfterFromDate = !result.fromDate  ||  date >= result.fromDate;
				const isBeforeFromDate = !result.endDate  ||  date <= result.endDate;
				return isAfterFromDate && isBeforeFromDate;
			})
			.map(({ fileFullpath, filename, fileContent}) => {
				let topics: ITopic[] = [];
				try {
					topics = getTopics(fileContent);
				}catch (err) {
					console.log(`Below error happens at: ${filename}`);
					throw Error(err);
				}
				return { fileFullpath, filename, topics };
			})
			.filter(({ topics }) => {
				if(result.topics.length === 0 ) return true;
				const lowerTopics = result.topics
				.map(resultTopic => resultTopic.toLowerCase());

				return topics.some(topic => getInTargets(lowerTopics, topic.title));
			})
			.filter(({ topics }) => {
				if(result.tags.length === 0) return true;

				const allTags = topics.reduce((tags, topic) => [...tags, ...topic.tags], []);
				const lowerTargets = result.tags.map(resultTag => resultTag.toLowerCase());
				
				return allTags.some(tag => getInTargets(lowerTargets, tag.text.toLowerCase()))
			})
			.map(({ topics , ...rest }) => {
				const lowerTopics = result.topics
				.map(resultTopic => resultTopic.toLowerCase());

				return {
					...rest, 
					topics: lowerTopics.length? topics.filter(topic => getInTargets(lowerTopics, topic.title)) : topics
				}
			})
			.map(({ topics , ...rest }) => {
				const lowerTags = result.tags
				.map(resultTag => resultTag.toLowerCase());

				return {
					...rest, 
					topics: lowerTags.length === 0 
						? topics
						:topics.filter(topic => {
							const lowerTargets = topic.tags.map(resultTag => resultTag.text.toLowerCase());
							return lowerTargets.some(tag => getInTargets(lowerTags, tag))
						}) 
				}
			})
			.map(getDairyDescription)
			.forEach(printDescription);
	}
