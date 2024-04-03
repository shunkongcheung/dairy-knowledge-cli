import fs from "fs";
import { IDairy } from "./getDairiesFromOptions";

export const combine = (dairies: IDairy[], tags: string[]) => {
	const result = tags[tags.length - 1];
	const toCombineTags = tags.slice(0, tags.length - 1);

	console.log("hello", toCombineTags, result);

	const promises = dairies.map(async({fileContent, fileFullpath }) => {
		toCombineTags.forEach(combineTag => {
			fileContent = fileContent.replace(new RegExp(combineTag, "g"), result)
		})

		return new Promise(resolve => fs.writeFile(fileFullpath, fileContent, () => resolve("")));
	});

	return Promise.all(promises);
}

