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
	.command("check")
	.description("check file(s) to see if it comply with the rules of this application")
	.argument("<filename>", "full file name. Or a directory name.")

	appendOptions(command).action(async (filename, options) => {
		const result = getOptionResult(options)
		const dairies = await getDairiesFromOptions(filename, result)
		check(dairies, result);
	});
	

	program.parse();

})();
