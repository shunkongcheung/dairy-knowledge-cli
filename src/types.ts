export enum TagType {
	Contact = "@",
	General = "#",
	Place = "&",
}

export interface ITag {
	text: string;
	type: TagType;
}

export interface IWithTags {
	tags: ITag[];
}

export interface ISpending extends IWithTags{
	amount: number;
	text: string;
}

export interface ITodo  extends IWithTags{
	finished: boolean;
	text: string;
}

export interface ITopic extends IWithTags{
	paragraphs: string[];
	spendings: ISpending[];
	todos: ITodo[];
	title: string;
}
