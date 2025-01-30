import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import {MongoClient} from "mongodb"

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL) throw new Error("Falta la URl del driver de MOngoDB")

const clienteMongo = new MongoClient(MONGO_URL);
await clienteMongo.connect();

/*const db = clienteMongo.db("db");
const collection_1 = db.collection<>("collection_1");
const collection_2 = db.collection<>("collection_1");*/

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
});

console.log(`Server running on: ${url}`);