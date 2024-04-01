import chalk from "chalk";
import { ISpending, ITopic, ITodo, ITag, TagType } from "./types";
import { getUniqueTags } from "./utils"

interface IDairy {
	fileFullpath: string;
	filename: string;
	topics: ITopic[];
}

const TagNames: Record<TagType, string> = {
	[TagType.Contact]:  "Contact",
	[TagType.Place]:  "Location",
	[TagType.General]:  "Other",
}

interface ILineProps {
	content: chalk.Chalk;
	title: chalk.Chalk;
}

type Result = string | Result[];

const getLine = (title: string, content: string, props?: Partial<ILineProps>) => {
	const defaultRender = (...text: unknown[]) => text.join();
	const contentRender = props?.content || defaultRender;
	const titleRender  = props?.title || chalk.bold;

	return `${titleRender(title)}: ${contentRender(content)}`;
}


const getJoinedTags = (tags: ITag[]) => {
	const descending = (a: ITag, b: ITag) => b.count - a.count;
	return [...tags].sort(descending).map(item => chalk.grey(`${item.text}(${item.count})`)).join(", ");
}

const getSpendingDescription = (spending: ISpending) => spending.text + ' ' +  getJoinedTags(spending.tags);
const getTodoDescription = (todo: ITodo) => `[${todo.finished ? 'x' : ' '}] ` + (todo.declined ? chalk.strikethrough(todo.text) : todo.text) + ' ' +  getJoinedTags(todo.tags);

const getParagraph = (paragraph: string) => {
	if(!paragraph) return "";

	const CUT_OFF = 80;
	paragraph = paragraph.replace('\n', ' ');
	if(paragraph.length > CUT_OFF) paragraph = paragraph.slice(0, CUT_OFF) + "...";
	return paragraph;
}

const getTopicDescription = (topic: ITopic) => {
	const title = getLine(topic.title, getParagraph(topic.paragraphs.join(" ")));

	const spendings = topic.spendings.map(spending => getSpendingDescription(spending));
	const todos = topic.todos.map(todo => getTodoDescription(todo));

	const tags = Object.values(TagType)
	.map(tagType => ({ tagType, tags: getJoinedTags(topic.tags.filter(tag => tag.type === tagType)) }))
	.filter(({ tags }) =>  tags.length)
	.map(({ tagType, tags }) => getLine(TagNames[tagType], tags))

	const LINE_SEPARATOR = '-------------------';
	return [
		title,
		...tags,
		(tags.length > 0 ?  LINE_SEPARATOR : ""),
		...spendings, 
		(spendings.length > 0 ?  LINE_SEPARATOR : ""),
		...todos,
	].filter(item => !!item);
}

export const getDairyDescription = (dairy: IDairy): Result[] => {
	const filename =  getLine("Filename", `${dairy.filename} (${dairy.fileFullpath})`, { content: chalk.green });

	const allTags = getUniqueTags(dairy.topics.reduce((tags, topic) => [...tags, ...topic.tags], []));

	const tags = Object.values(TagType)
	.map(tagType => ({ tagType, tags: getJoinedTags(allTags.filter(tag => tag.type === tagType)) }))
	.filter(({ tags }) =>  tags.length)
	.map(({ tagType, tags }) => getLine(TagNames[tagType], tags))

	const topics = dairy.topics.map(topic => getTopicDescription(topic));

	return [
		filename,
		...tags,
		topics,
	];
}

export const printDescription = (description: Result[]) => {
	description.forEach(content => {
		if(Array.isArray(content)) {
			console.group();
			printDescription(content);
			console.groupEnd();
			if(content.filter(Boolean).length) console.log();
		} else {
			console.log(content);
		}
	});
}
