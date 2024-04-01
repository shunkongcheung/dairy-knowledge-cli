import { program } from "commander";
import { check } from "./check";


(async () => {

	program
	.name("dairy-knowledge cli")
	.description("A CLI to help me understand my schedule, spending, and more")
	.version("1.0.0");

	program
	.command("check")
	.description("check file(s) to see if it comply with the rules of this application")
	.argument("<filename>", "full file name. Or a directory name.")
	.option("-a --tags <tags>", "Filter by topics")
	.option("-e --endDate <endDate>", "End date")
	.option("-f --fromDate <fromDate>", "From date")
	.option("-o --topics <topics>", "Filter by topics")
	.action(check);

	program.parse();

})();
