import { Token } from "marked";
import { getTagsFromToken } from "./getTagsFromToken";
import { ITodo, ITodoList } from "./types";
import { getIsList } from "./utils";


const CUTOUT_INDICATOR = "~~";
const CUTOFF_REGEX = new RegExp(CUTOUT_INDICATOR, "g");

export const getTodoListFromToken = (token: Token): ITodoList => {
	const isList = getIsList(token);

	if(!isList) return null;

	const todoItems = token.items.filter(item => item.task)
	if(!todoItems.length || todoItems.length !== token.items.length) return null;

	const todos: ITodo[] = todoItems.map(todoItem => {
		let text = todoItem.text;
		const isDeclined = text.startsWith(CUTOUT_INDICATOR) && text.endsWith(CUTOUT_INDICATOR);
		if(isDeclined) text = text.replace(CUTOFF_REGEX, "");

		return { declined: isDeclined,finished: todoItem.checked, text }
	});

	return { items: todos, tags: getTagsFromToken(token) };
}


