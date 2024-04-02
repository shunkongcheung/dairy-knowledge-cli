import { marked, TokensList } from "marked";
import { getFileInfos, IFileInfo } from "./getFileInfos";
import { IOptions } from "./getOptionResult";
import { getTopicsFromTokensList } from "./getTopicsFromTokensList";
import { ITopic } from "./types";

export interface IDairy extends IFileInfo {
	topics: ITopic[];
	tokensList: TokensList;
}

const getInTargets = (targets: string[], text: string) => targets.some(target => text.toLowerCase().includes(target));

const getDairy = ({ filename, fileContent, ...rest }: IFileInfo): IDairy => {
	let tokensList: TokensList;
	let topics: ITopic[];
	try {
		tokensList = marked.lexer(fileContent);
		topics = getTopicsFromTokensList(tokensList);
		console.log(topics)
	}catch (err) {
		console.log(`Below error happens at: ${filename}`);
		throw Error(err);
	}
	return { ...rest, filename, fileContent, topics, tokensList };
}

const filterByTopics = (targetTopics: string[]) => {
	if(targetTopics.length === 0 ) return () => true;
	const lowerTopics = targetTopics.map(targetTopic => targetTopic.toLowerCase());

	return 	({ topics }: IDairy) => topics.some(topic => getInTargets(lowerTopics, topic.title));
}

const getTopicsWithTagFilteredSections = (targetTags: string[]) => {
	if(targetTags.length === 0 ) return (dairy: IDairy) => dairy;
	const lowerTags = targetTags.map(targetTags => targetTags.toLowerCase());

	return 	({ topics, ...restDairy }: IDairy) => {
		return {
			...restDairy,
			topics: topics.map(({ sections, ...restTopic }) => ({
				sections: sections.filter(section => section.tags.some(tag => getInTargets(lowerTags, tag.text))),
				...restTopic
			}))
		}
	}
}


const getTopicsWithTodoListFilteredSections = (isTodoOnly: boolean) => {
	if(!isTodoOnly) return (dairy: IDairy) => dairy;

	return 	({ topics, ...restDairy }: IDairy) => {
		return {
			...restDairy,
			topics: topics.map(({ sections, ...restTopic }) => ({
				sections: sections.filter(section => section.components.some(component => "items" in component && "finished" in component.items[0])),
				...restTopic
			}))
		}
	}
}

const getTopicsWithSpendingListFilteredSections = (isSpendingOnly: boolean) => {
	if(!isSpendingOnly) return (dairy: IDairy) => dairy;

	return 	({ topics, ...restDairy }: IDairy) => {
		return {
			...restDairy,
			topics: topics.map(({ sections, ...restTopic }) => ({
				sections: sections.filter(section => section.components.some(component => "items" in component && "amount" in component.items[0])),
				...restTopic
			}))
		}
	}
}

const getTopicsWithSections = (dairy: IDairy) => ({
	...dairy,
	topics: dairy.topics.filter(topic => topic.sections.length)
})

const filterDairyWithTopics = (dairy: IDairy) =>  dairy.topics.length;

export const getDairiesFromOptions = async (filename: string, options: IOptions): Promise<IDairy[]> => {
	const fileInfos = await getFileInfos(filename);
	const { isSpendingOnly, isTodoOnly, fromDate, endDate, topics, tags } = options;

	return fileInfos
	.filter(({ date }) => {
		const isAfterFromDate = !fromDate  ||  date >= fromDate;
		const isBeforeFromDate = !endDate  ||  date <= endDate;
		return isAfterFromDate && isBeforeFromDate;
	})
	.map(getDairy)
	.filter(filterByTopics(topics))
	.map(getTopicsWithTagFilteredSections(tags))
	.map(getTopicsWithTodoListFilteredSections(isTodoOnly))
	.map(getTopicsWithSpendingListFilteredSections(isSpendingOnly))
	.map(getTopicsWithSections)
	.filter(filterDairyWithTopics)
}

