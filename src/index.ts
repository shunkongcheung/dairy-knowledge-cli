import { program } from "commander";
import { appendOptions, getOptionResult } from "./getOptionResult";
import { getDairiesFromOptions } from "./getDairiesFromOptions";
import { check } from "./check";


(async () => {

	program
	.name("dairy-knowledge cli")
	.description("A CLI to help me understand my schedule, spending, and more")
	.version("1.0.0");

	const command = program
	.command("show")
	.description("Show file content")

	appendOptions(command)
	.option("-r --isRaw", "Print content as waw markdown format")
	.action(async (filename, options) => {
		const result = getOptionResult(options)
		const dairies = await getDairiesFromOptions(filename, result)

		const isRaw = !!options.isRaw;
		check(dairies, { isRaw });
	});
	

	program.parse();

})();
