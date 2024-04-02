import { marked, Token, Tokens } from 'marked';
import { getSpendingListFromToken } from "./getSpendingListFromToken";
import { getTagsFromToken } from "./getTagsFromToken";
import { getTodoListFromToken } from "./getTodoListFromToken";
import { IComponent, ITopic, ISection } from "./types";

const getIsH1 = (token: Token): token is Tokens.Heading => (token.type === "heading" && token.depth === 1);
const getIsParagraph = (token: Token): token is Tokens.Heading => (token.type === "paragraph");
const getIsSpace = (token: Token): token is Tokens.List => token.type === "space";

const getEmptySection = (): ISection => ({ components: [], tags: [] });

const getEmptyTopic = (title?: string): ITopic => ({ title: title || "", sections: [getEmptySection()], tags: [] });

const getParagraphFromToken = (token: Token) => ({ text: getIsParagraph(token) ? token.text : token.raw, tags: getTagsFromToken(token) });


export const getTopics = (fileContent: string): ITopic[] => {
	const tokens = marked.lexer(fileContent);

	const topics: ITopic[] = [getEmptyTopic()];

	tokens.forEach((token: Token) => {
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
		const component: IComponent = getTodoListFromToken(token) || getSpendingListFromToken(token) || getParagraphFromToken(token);

		lastTopic.tags = [...lastTopic.tags, ...component.tags];
		lastSection.tags = [...lastSection.tags, ...component.tags];
		lastSection.components.push(component);
	});

	return topics;
}


