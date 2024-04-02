import { Token, Tokens } from "marked";
import { ITag } from "./types";

export const getIsList = (token: Token): token is Tokens.List => token.type === "list";

export const getUniqueTags = (tags: ITag[]) => {
	const uniqueTags: ITag[] = [];
	const getIsSameTag = (left: ITag, right:ITag) => left.text === right.text;

	tags.forEach(tag => {
		const existingTag = uniqueTags.find(uniqueTag => getIsSameTag(tag, uniqueTag));
		if(!existingTag) uniqueTags.push({... tag });
		else  existingTag.count += tag.count;
	});

	return uniqueTags;
}


