import { MongoMemoryServer } from "mongodb-memory-server";

declare global {
    var __MONGOD__: MongoMemoryServer | undefined;
}

export { };
