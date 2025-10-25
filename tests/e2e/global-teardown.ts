async function globalTeardown() {
    if (global.__MONGOD__) {
        console.log("🧹 Stopping in-memory MongoDB...");
        await global.__MONGOD__.stop();
    }
}

export default globalTeardown;
