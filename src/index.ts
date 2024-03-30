import { program } from "commander";
import { getFileInfo } from "./getFileInfo";
import { getTopics } from "./getTopics";
import { ITopic } from "./types";

interface IDairy {
	date: Date;
	topics: ITopic[];
}

(async () => {

	program
	.name("dairy-knowledge cli")
	.description("A CLI to help me understand my schedule, spending, and more")
	.version("1.0.0");

	program
		.command("check")
		.description("check one file to see if it comply with the rules of this application")
		.argument("<filename>", "full file name")
		.action(async fileFullpath => {
			const { date, fileContent } = await getFileInfo(fileFullpath);

			const dairy: IDairy = { date, topics: getTopics(fileContent) }
			
			console.log(JSON.stringify(dairy, null, 4));
		});

		program.parse();

})();
