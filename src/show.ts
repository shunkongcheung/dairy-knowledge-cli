import { getDairyDescription, printDescription } from "./getDairyDescription";
import { IDairy } from "./getDairyDescription";

export const show = async (dairies: IDairy[], { isRaw }: { isRaw: boolean }) => {
	dairies.map(getDairyDescription(isRaw)).forEach(printDescription);
}
