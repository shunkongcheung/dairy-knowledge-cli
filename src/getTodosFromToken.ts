import { Token } from "marked";
import { getTagsFromToken } from "./getTagsFromToken";
import { ITodo } from "./types";
import { getIsList } from "./utils";


const CUTOUT_INDICATOR = "~~";
const CUTOFF_REGEX = new RegExp(CUTOUT_INDICATOR, "g");

export const getTodosFromToken = (token: Token): ITodo[] => {
	const isList = getIsList(token);

	if(!isList) {
		return "tokens" in token 
			? token.tokens.reduce((prev, childToken) => [...prev, ...getTodosFromToken(childToken)], [] as ITodo[])
			: getIsList(token)
				? token.items.reduce((prev, childItem) => [...prev, ...getTodosFromToken(childItem)], [] as ITodo[])
				: [];
	}

	const todoItems = token.items.filter(item => item.task)

	const todos: ITodo[] = todoItems.map(todoItem => {
		let text = todoItem.text;
		const isDeclined = text.startsWith(CUTOUT_INDICATOR) && text.endsWith(CUTOUT_INDICATOR);
		if(isDeclined) text = text.replace(CUTOFF_REGEX, "");

		return {
		declined: isDeclined,
		finished: todoItem.checked,
		text,
		tags: getTagsFromToken(todoItem)
	}
	});

	return todos;
}


