import { Token, TokensList, Tokens } from 'marked';
import { getBaseComponentFromToken } from "./getBaseComponentFromToken";
import { getSpendingListFromToken } from "./getSpendingListFromToken";
import { getTagsFromToken } from "./getTagsFromToken";
import { getTodoListFromToken } from "./getTodoListFromToken";
import { IComponent, ITopic, ISection } from "./types";

const getIsH1 = (token: Token): token is Tokens.Heading => (token.type === "heading" && token.depth === 1);
const getIsSpace = (token: Token): token is Tokens.List => token.type === "space";

const getEmptySection = (): ISection => ({ components: [], tags: [] });

const getEmptyTopic = (title?: string): ITopic => ({ title: title || "", sections: [getEmptySection()] });

export const getTopicsFromTokensList = (tokensList: TokensList): ITopic[] => {
	const topics: ITopic[] = [getEmptyTopic()];

	tokensList.forEach((token: Token) => {
		const lastTopic = topics[topics.length - 1];

		if(getIsH1(token)) {
			const title = token.text;
			if(lastTopic.title) topics.push(getEmptyTopic(title));
			else lastTopic.title = title;
			return;
		}

		if(getIsSpace(token)) {
			lastTopic.sections.push(getEmptySection())
			return;
		}

		if(!lastTopic.title) throw Error(`No topic for next token ${token.raw}`);

		const lastSection = lastTopic.sections[lastTopic.sections.length -1];
		const component: IComponent = getTodoListFromToken(token) || getSpendingListFromToken(token) || getBaseComponentFromToken(token);

		lastSection.tags = [...lastSection.tags, ...getTagsFromToken(token)];
		lastSection.components.push(component);
	});

	return topics;
}


