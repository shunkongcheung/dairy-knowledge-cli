import { Token, Tokens } from "marked";
import { ITag, TagType } from "./types";
import { getIsList, getUniqueTags } from "./utils";

const getIsLink = (token: Token): token is Tokens.Link => token.type === "link";

const getTagType = (text: string) => {
	const tagTypes = Object.values(TagType);
	for(let idx = 0; idx < tagTypes.length; idx ++) {
		const targetTagType = tagTypes[idx];
		const isTargetTagType = text.startsWith(targetTagType);
		if(isTargetTagType)  return targetTagType;
	}
	return null;
}

const getAllTags = (token: Token): ITag[] => {
	const isLink = getIsLink(token);
	if(!isLink) {
		return "tokens" in token 
		? token.tokens.reduce((prev, childToken) => [...prev, ...getAllTags(childToken)], [] as ITag[])
		: getIsList(token)
		? token.items.reduce((prev, childItem) => [...prev, ...getAllTags(childItem)], [] as ITag[])
		: [];
	}

	const tagText = token.text
	const tagType = getTagType(tagText);

	return tagType ? [{ count: 1, type: tagType, text: token.text  }] : [];
}

export const getTagsFromToken = (token: Token):ITag[]  => getUniqueTags(getAllTags(token));
