import { Token } from "marked";
import { getTagsFromToken } from "./getTagsFromToken";
import { ISpending, ISpendingList } from "./types";
import { getIsList } from "./utils";

const getSpendingAmount = (text: string) => {
	const matchText = text.match(/\$\d+[.]?\d*/g)?.[0];
	if(!matchText) return NaN;
	const amountText = matchText.slice(1);
	const amount = parseFloat(amountText);
	return amount;
}

export const getSpendingListFromToken = (token: Token): ISpendingList => {
	const isList = getIsList(token);

	if(!isList) return null;

	const spendingItems = token.items.filter(item => item.text).filter(item => !isNaN(getSpendingAmount(item.text)))
	if(!spendingItems.length || spendingItems.length !== token.items.length) return null;

	const spendings: ISpending[] = spendingItems.map(amountItem => ({
		amount: getSpendingAmount(amountItem.text),
		text: amountItem.text,
		tags: getTagsFromToken(amountItem)
	}));

	return { items: spendings, tags: getTagsFromToken(token) };
}


