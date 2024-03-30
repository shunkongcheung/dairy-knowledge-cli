import { marked, Token } from 'marked';
import { getSpendingsFromToken } from "./getSpendingsFromToken";
import { getTagsFromToken } from "./getTagsFromToken";
import { getTodosFromToken } from "./getTodosFromToken";
import { ITopic } from "./types";
import { getIsH1, getIsParagraph } from "./utils";


export const getTopics = (fileContent: string): ITopic[] => {
	const tokens = marked.lexer(fileContent);

	const topics: ITopic[] = [];
	let topic: ITopic = null;

	tokens.forEach((token: Token) => {
		if(getIsH1(token)) {
			if(topic) topics.push(topic);
			topic = { title: token.text, todos: [], spendings: [], tags: [], paragraphs: [] };
			return;
		}

		if(!topic) {
			if("text" in token) throw Error(`No topic for paragraph ${token.text.slice(0, 20)}...`);
			return;
		}

		if(getIsParagraph(token)) topic.paragraphs.push(token.text);

		topic.tags = [...topic.tags, ...getTagsFromToken(token)];
		topic.todos = [...topic.todos, ...getTodosFromToken(token)];
		topic.spendings = [...topic.spendings, ...getSpendingsFromToken(token)];
	});

	if(topic) topics.push(topic);

	return topics;
}


