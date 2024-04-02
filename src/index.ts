import { program } from "commander";
import { appendOptions, getOptionResult } from "./getOptionResult";
import { getDairiesFromOptions } from "./getDairiesFromOptions";
import { combine } from "./combine";
import { show } from "./show";
import { list } from "./list";
import { rename } from "./rename";


(async () => {

	program
	.name("dairy-knowledge cli")
	.description("A CLI to help me understand my schedule, spending, and more")
	.version("1.0.0");

	const commandShow = program
	.command("show")
	.description("Show file content")

	appendOptions(commandShow)
	.option("-r --isRaw", "Print content as waw markdown format")
	.action(async (filename, options) => {
		const result = getOptionResult(options)
		const dairies = await getDairiesFromOptions(filename, result)

		const isRaw = !!options.isRaw;
		show(dairies, { isRaw });
	});
	

	const actionDescription =  "Choose from one of the action: list, combine, rename"
	const commandTags = program
	.command("tags")
	.description("Organize tags")

	appendOptions(commandTags)
	.argument("<action>", actionDescription)
	.action(async (filename, action, options) => {
		const result = getOptionResult(options)
		const dairies = await getDairiesFromOptions(filename, result)

		if(action === "combine") return combine(dairies);
		if(action === "list") return list(dairies);
		if(action === "rename") return rename(dairies);
		
		throw Error(`Unknown action ${action}. ${actionDescription}.`);
	});

	program.parse();

})();
