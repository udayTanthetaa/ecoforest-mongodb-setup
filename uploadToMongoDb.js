// import clientPromise from "./mongodb/index.js";
import * as fs from "fs";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

const main = async () => {
	try {
		dotenv.config();

		const uri = process.env.MONGODB_URI;
		const client = new MongoClient(uri);

		await client.connect();

		const nfts = client.db("echoforest").collection("nfts");

		for (let i = 1; i <= 52; i++) {
			const files = await fs.promises.readdir(`./correctedJsonData/Week${i}`);

			for (let j = 0; j < files.length; j++) {
				const rawData = await fs.promises.readFile(`./correctedJsonData/Week${i}/${files[j]}`);
				const jsonData = await JSON.parse(rawData);

				const doc = {
					_id: jsonData.edition.toString(),
					...jsonData,
				};

				await nfts.insertOne(doc);
			}
		}

		await client.close();
	} catch (error) {
		console.error(error);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
