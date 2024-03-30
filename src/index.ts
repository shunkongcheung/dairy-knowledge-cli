import fs from "fs";
import { getTopics } from "./getTopics";
import { ITopic } from "./types";

interface IDairy {
	date: Date;
	topics: ITopic[];
}

(async () => {
	const fileContent = fs.readFileSync("./test.md", { encoding: "utf-8" });
	const dairy: IDairy = {
		date: new Date(),
		topics: getTopics(fileContent)
	}

	console.log(JSON.stringify(dairy, null, 4));
})();
