import fs from "fs";
import path from "path";

interface IFileInfo { 
	date: Date;
	filename: string;
	fileContent: string;
}

export const getFileInfo = async (fileFullpath: string): Promise<IFileInfo> => {
  const isExist = fs.existsSync(fileFullpath);
  if(!isExist) throw Error("File does not exist.");
    
	const parsedPath = path.parse(fileFullpath);
	if(parsedPath.ext !== ".md") throw Error("Invalid file format. Only markdown(.md) is supported.");

	const filename = parsedPath.name.replace(/_/g, "-");
	const isDateFormat = filename.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0]
	if(!isDateFormat) throw Error("Invalid file name format. Only dated name (yyyy-dd-mm.md) is supported.");

	const date = new Date(filename);

	return new Promise<IFileInfo>((resolve, reject) => {
		fs.readFile(fileFullpath, { encoding: "utf-8" }, (err, fileContent) => {
			if(err) return reject(err);
			resolve({ date, fileContent, filename: parsedPath.base });
		});
	});
}


