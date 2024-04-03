import chalk from "chalk";
import { IDairy } from "./getDairiesFromOptions";
import { ITag } from "./types"
import { getUniqueTags } from "./utils";

interface IAppearance {
	count: number;
	date: Date;
	filename: string;
}

type IItem = [string, IAppearance[]];

const getTagMap = (dairies: IDairy[]) => {
	const tagMap: Record<string, IAppearance[]> = {};

	dairies.forEach(dairy => {
		const { topics, filename, date } = dairy;

		const allTags = 
			topics.reduce((topicTags, topic) => [
			...topicTags,
			...topic.sections.reduce((sectionTags, section) => [...sectionTags, ...section.tags], [])
		], [] as ITag[]);

		const uniqueTags = getUniqueTags(allTags);

		uniqueTags.forEach(tag => {
			if(!tagMap[tag.text]) tagMap[tag.text] = [];
			tagMap[tag.text].push({ count: tag.count, date, filename });
		});
	});

	return tagMap;
}

export const list = (dairies: IDairy[], { sortBy, orderBy }: { sortBy: "text" | "count", orderBy: "a" | "d" }) => {
	const tagMap = getTagMap(dairies);

	const sort = (left: IItem, right: IItem) => {
		if(sortBy === "text") {
			const compareLeft = orderBy === "a" ? left[0] : right[0];
			const compareRight = orderBy === "a" ? right[0] : left[0];
			return compareLeft.localeCompare(compareRight)
		}

		const leftTotal = left[1].reduce((total, appearance) => total + appearance.count, 0);
		const rightTotal = right[1].reduce((total, appearance) => total + appearance.count, 0);

		return orderBy === "a" ? (leftTotal - rightTotal) : (rightTotal - leftTotal);
	}

	Object.entries(tagMap)
		.sort(sort)
		.forEach(([tagText, appearances]) => {
			const title = chalk.bold(tagText);
			const appearanceText = appearances
				.sort((left, right) => Number(left.date) - Number(right.date))
				.map(appearance => `${chalk.green(appearance.filename)}(${appearance.count})`)
				.join("; ");

			const total = appearances.reduce((total, appearance) => total + appearance.count, 0);
			console.log(`${chalk.bold(title)}(${chalk.bold(total)}): ${appearanceText}`)
		});


}
