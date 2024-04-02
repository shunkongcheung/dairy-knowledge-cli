export enum TagType {
	Contact = "@",
	General = "#",
	Place = "&",
}

export interface ITag {
	count: number;
	text: string;
	type: TagType;
}

export interface IWithTags {
	tags: ITag[];
}

export interface ISpending {
	amount: number;
	text: string;
}

export interface ITodo {
	declined: boolean;
	finished: boolean;
	text: string;
}

interface IList<T> extends IWithTags{
	items: T[]
}

export type ISpendingList = IList<ISpending>;
export type ITodoList = IList<ITodo>;

interface IParagraph extends IWithTags {
	text: string;
}

export type IComponent = ISpendingList | ITodoList | IParagraph;

export interface ISection extends IWithTags{
	components: IComponent[];
}

export interface ITopic extends IWithTags{
	sections: ISection[];
	title: string;
}

