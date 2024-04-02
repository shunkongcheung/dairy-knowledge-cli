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

export interface ISpending {
	amount: number;
	text: string;
}

export interface ITodo {
	declined: boolean;
	finished: boolean;
	text: string;
}

interface IBaseComponent {
	text: string;
}

interface IList<T> extends IBaseComponent{
	items: T[]
}

export type ISpendingList = IList<ISpending>;
export type ITodoList = IList<ITodo>;


export type IComponent = ISpendingList | ITodoList | IBaseComponent;

export interface ISection {
	components: IComponent[];
	tags: ITag[];
}

export interface ITopic {
	sections: ISection[];
	title: string;
}

