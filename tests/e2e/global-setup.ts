import { MongoMemoryServer } from "mongodb-memory-server";
import { writeFileSync } from "fs";
import path from "path";

async function globalSetup() {
    console.log("🚀 Starting in-memory MongoDB for testing...");
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log(`🧩 Connected to in-memory MongoDB: ${uri}`);

    // Create a temporary .env.test file for Playwright
    const envPath = path.resolve(process.cwd(), ".env.test");
    writeFileSync(
        envPath,
        `DATABASE_URL=${uri}\nNODE_ENV=test\n`
    );

    console.log("✅ MongoDB test environment is ready");

    // Save server instance for teardown
    global.__MONGOD__ = mongod;
}

export default globalSetup;
