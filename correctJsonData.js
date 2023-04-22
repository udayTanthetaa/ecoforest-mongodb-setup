// import clientPromise from "./mongodb/index.js";
import * as fs from "fs";
import { MongoClient } from "mongodb";

const correctJson = async () => {
	let attributes = new Set();

	for (let i = 1; i <= 52; i++) {
		const files = await fs.promises.readdir(`./jsonData/Week${i}`);

		for (let j = 0; j < files.length; j++) {
			const metadata = await fs.promises.readFile(`./jsonData/Week${i}/${files[j]}`);
			let json = await JSON.parse(metadata);

			for (let k = 0; k < json.attributes.length; k++) {
				if (json.attributes[k].trait_type === "BackGround") {
					json.attributes[k].trait_type = "Background";
				}

				if (json.attributes[k].trait_type === "Eyepatch") {
					json.attributes[k].trait_type = "Eye Patch";
				}

				if (json.attributes[k].value === "Nature_s Revitalizing Essence(1)") {
					json.attributes[k].value = "Nature's Revitalizing Essence";
				}

				if (json.attributes[k].value === "Moros_s Fate(1)") {
					json.attributes[k].value = "Moros's Fate";
				}

				if (json.attributes[k].value === "Hood of Hungering Doom(1)") {
					json.attributes[k].value = "Hood of Hungering Doom";
				}

				json.attributes[k].value = json.attributes[k].value.replaceAll("_", "'");
			}

			await fs.promises.writeFile(`./correctedJsonData/Week${i}/${files[j]}`, JSON.stringify(json));
		}
	}

	return attributes;
};

const main = async () => {
	try {
		await correctJson();
	} catch (error) {
		console.error(error);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
