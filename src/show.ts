import chalk from "chalk";
import { IDairy } from "./getDairiesFromOptions";
import { ITopic, ITag, TagType } from "./types";
import { getUniqueTags } from "./utils";

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

const getPrettifyTag = (text: string) =>  text.replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/gm, chalk.underline.blueBright('$1'));
const getPrettyStrikethrough = (text: string) => text.replace(/~~(.*?)~~/g, chalk.strikethrough.blackBright('$1'))

const getPrettify = (text: string, isRaw: boolean) => isRaw ? text : getPrettyStrikethrough(getPrettifyTag(text));

const getTopicDescription = (topic: ITopic, isRaw: boolean) => {
	const title = topic.title;
	const allTags = topic.sections.reduce((tags, section) => [...tags, ...section.tags], [] as ITag[]);

	const tagsByType = Object.values(TagType)
		.map(tagType => ({ tagType, tags: getJoinedTags(getUniqueTags(allTags.filter(tag => tag.type === tagType))) }))
		.filter(({ tags }) =>  tags.length)
		.map(({ tagType, tags }) => getLine(TagNames[tagType], tags))

	const LINE_SEPARATOR = '-------------------';
	const sections = topic.sections.map(section => section.components.map(component => getPrettify(component.text, isRaw)))

	return [
		title,
		...tagsByType,
		(tagsByType.length > 0 ?  LINE_SEPARATOR : ""),
		...sections,
	].filter(item => !!item);
}


const getDairyDescription = (isRaw: boolean) => (dairy: IDairy): Result[] => {
	const filename =  getLine("Filename", `${dairy.filename} (${dairy.fileFullpath})`, { content: chalk.green });

	const topics = dairy.topics.map(topic => getTopicDescription(topic, isRaw));

	return [
		filename,
		...topics,
	];
}

const printDescription = (description: Result[]) => {
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

export const show = async (dairies: IDairy[], { isRaw }: { isRaw: boolean }) => {
	dairies.map(getDairyDescription(isRaw)).forEach(printDescription);
}
