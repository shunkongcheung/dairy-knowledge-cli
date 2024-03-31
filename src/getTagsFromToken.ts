import { Token } from "marked";
import { ITag, TagType } from "./types";
import { getIsLink, getIsList, getUniqueTags } from "./utils";

const getTagsByType = (token: Token, tagType: TagType): ITag[] => {
	const isLink = getIsLink(token);
	if(!isLink) {
		return "tokens" in token 
		? token.tokens.reduce((prev, childToken) => [...prev, ...getTagsByType(childToken, tagType)], [] as ITag[])
		: getIsList(token)
		? token.items.reduce((prev, childItem) => [...prev, ...getTagsByType(childItem, tagType)], [] as ITag[])
		: [];
	}

	const isTag = token.text.startsWith(tagType);
	return isTag ? [{ type: tagType, text: token.text  }] : [];
}


export const getTagsFromToken = (token: Token):ITag[]  => getUniqueTags(
	Object.values(TagType).reduce((prev, tagType) => [...prev, ...getTagsByType(token, tagType)], [] as ITag[])
);
