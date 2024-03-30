import { Token } from "marked";
import { getTagsFromToken } from "./getTagsFromToken";
import { ITodo } from "./types";
import { getIsList } from "./utils";

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

	const todos: ITodo[] = todoItems.map(todoItem => ({
		finished: todoItem.checked,
		text: todoItem.text,
		tags: getTagsFromToken(todoItem)
	}));

	return todos;
}


