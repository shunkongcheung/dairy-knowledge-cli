import { Token, Tokens } from "marked";
import { ITag } from "./types";

export const getIsH1 = (token: Token): token is Tokens.Heading => (token.type === "heading" && token.depth === 1);
export const getIsParagraph = (token: Token): token is Tokens.Heading => (token.type === "paragraph");
export const getIsList = (token: Token): token is Tokens.List => token.type === "list";
export const getIsLink = (token: Token): token is Tokens.Link => token.type === "link";

export const getUniqueTags = (tags: ITag[]) => {
	const uniqueTags: ITag[] = [];
	const getIsSameTag = (left: ITag, right:ITag) => left.text === right.text;

	tags.forEach(tag => {
		const isExist = uniqueTags.find(uniqueTag => getIsSameTag(tag, uniqueTag));
		if(!isExist) uniqueTags.push(tag);
	});

	return uniqueTags;
}


