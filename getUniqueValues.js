// import clientPromise from "./mongodb/index.js";
import * as fs from "fs";
import { MongoClient } from "mongodb";

const getAttributes = async () => {
	let attributes = new Set();

	for (let i = 1; i <= 52; i++) {
		const files = await fs.promises.readdir(`./correctedJsonData/Week${i}`);

		for (let j = 0; j < files.length; j++) {
			const metadata = await fs.promises.readFile(`./correctedJsonData/Week${i}/${files[j]}`);
			const json = await JSON.parse(metadata);

			for (let k = 0; k < json.attributes.length; k++) {
				attributes.add(json.attributes[k].trait_type);
			}
		}
	}

	return attributes;
};

const getAttributeSet = async (attributeName, attributesDisplay) => {
	try {
		let arr = new Set();

		for (let i = 1; i <= 52; i++) {
			const files = await fs.promises.readdir(`./correctedJsonData/Week${i}`);

			for (let j = 0; j < files.length; j++) {
				const metadata = await fs.promises.readFile(`./correctedJsonData/Week${i}/${files[j]}`);
				const json = await JSON.parse(metadata);

				for (let k = 0; k < json.attributes.length; k++) {
					if (json.attributes[k].trait_type === attributesDisplay) {
						arr.add(json.attributes[k].value);
					}
				}
			}
		}

		return arr;
	} catch (err) {
		console.log(err);
	}
};

const createJsFile = async (arr, name) => {
	try {
		await fs.promises.writeFile(`./attributeConstants/${name}.js`, `export const ${name} = [`);

		await fs.promises.writeFile(`./attributeConstants/${name}.js`, `\n"Any",`, {
			flag: "a+",
		});

		for (let i = 0; i < arr.length; i++) {
			await fs.promises.writeFile(`./attributeConstants/${name}.js`, `\n"${arr[i]}",`, {
				flag: "a+",
			});
		}

		await fs.promises.writeFile(`./attributeConstants/${name}.js`, `\n];`, {
			flag: "a+",
		});
	} catch (err) {
		console.log(err);
	}
};

const createIndex = async (values, displays, name) => {
	try {
		// creating blank file
		await fs.promises.writeFile(`./attributeConstants/${name}.js`, ``);

		// import statements
		for (let i = 0; i < values.length; i++) {
			await fs.promises.writeFile(
				`./attributeConstants/${name}.js`,
				`\nimport { ${values[i]} } from "./${values[i]}.js";`,
				{
					flag: "a+",
				}
			);
		}

		// files related to attributes
		await fs.promises.writeFile(`./attributeConstants/${name}.js`, `\n\nconst Attributes = [`, {
			flag: "a+",
		});

		for (let i = 0; i < values.length; i++) {
			await fs.promises.writeFile(
				`./attributeConstants/${name}.js`,
				`\n
					{
						value: "${values[i]}",
						display: "${displays[i]}",
						list: ${values[i]},
					},
				`,
				{
					flag: "a+",
				}
			);
		}

		await fs.promises.writeFile(`./attributeConstants/${name}.js`, `\n];`, {
			flag: "a+",
		});

		// writing export statement
		await fs.promises.writeFile(`./attributeConstants/${name}.js`, `export { Attributes };`, {
			flag: "a+",
		});
	} catch (err) {
		console.log(err);
	}
};

const main = async () => {
	try {
		let attributesDisplay = await getAttributes();
		attributesDisplay = Array.from(attributesDisplay);

		let attributes = [];

		for (let i = 0; i < attributesDisplay.length; i++) {
			attributes.push(attributesDisplay[i].replaceAll(" ", "_"));
		}

		for (let i = 0; i < attributes.length; i++) {
			const newSet = await getAttributeSet(attributes[i], attributesDisplay[i]);
			const arr = Array.from(newSet);
			const name = attributes[i];

			await createJsFile(arr, name);
		}

		await createIndex(attributes, attributesDisplay, "index");
	} catch (error) {
		console.error(error);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
