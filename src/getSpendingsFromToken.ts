import { Token } from "marked";
import { getTagsFromToken } from "./getTagsFromToken";
import { ISpending } from "./types";
import { getIsList } from "./utils";

const getSpendingAmount = (text: string) => {
	const matchText = text.match(/\$\d+[.]?\d*/g)?.[0];
	if(!matchText) return NaN;
	const amountText = matchText.slice(1);
	const amount = parseFloat(amountText);
	return amount;
}

export const getSpendingsFromToken = (token: Token): ISpending[] => {
	const isList = getIsList(token);

	if(!isList) {
		return "tokens" in token 
			? token.tokens.reduce((prev, childToken) => [...prev, ...getSpendingsFromToken(childToken)], [] as ISpending[])
			: getIsList(token)
				? token.items.reduce((prev, childItem) => [...prev, ...getSpendingsFromToken(childItem)], [] as ISpending[])
				: [];
	}

	const spendingItems = token.items.filter(item => item.text).filter(item => !isNaN(getSpendingAmount(item.text)))

	const spendings: ISpending[] = spendingItems.map(amountItem => ({
		amount: getSpendingAmount(amountItem.text),
		text: amountItem.text,
		tags: getTagsFromToken(amountItem)
	}));

	return spendings;
}


