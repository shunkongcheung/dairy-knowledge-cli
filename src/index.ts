import { program } from "commander";
import { appendOptions, getOptionResult } from "./getOptionResult";
import { getDairiesFromOptions } from "./getDairiesFromOptions";
import { combine } from "./combine";
import { show } from "./show";
import { list } from "./list";


(async () => {

	program
	.name("dairy-knowledge cli")
	.description("A CLI to help me understand my schedule, spending, and more")
	.version("1.0.0");

	// show 
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
	

	// tag list
	const commandList = program
	.command("tags_list")
	.description("List tags")

	appendOptions(commandList)
	.option("-B --sortBy <sortBy>", "Sort by text order or sort by count")
	.option("-d --orderBy <orderBy>", "Sort ascending or descending")
	.action(async (filename, options) => {
		const result = getOptionResult(options)
		const dairies = await getDairiesFromOptions(filename, result)

		const orderBy = options.orderBy === "a" ? "a" : "d";
		const sortBy = options.sortBy === "text" ? "text" : "count";

		list(dairies, { orderBy, sortBy });
	});

	// tag list
	const commandCombine = program
	.command("tags_combine")
	.description("Combine tags")

	appendOptions(commandCombine)
	.argument("<tags...>", "Tags to combine. The last input is used as the result text.")
	.action(async (filename: string, tags: string[], options) => {
		if(tags.length < 2) throw Error("At least two tags should be provided");

		const result = getOptionResult(options)
		const dairies = await getDairiesFromOptions(filename, result)

		await combine(dairies, tags);
	});


	program.parse();

})();
