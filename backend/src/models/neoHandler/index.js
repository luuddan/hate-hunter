import neo4j from "neo4j-driver" 

const driver = neo4j.driver('bolt://localhost:11003', neo4j.auth.basic('neo4j', ''));

class neoHandler {
    async query(value, object) {
        const session = driver.session()
        try {
            const queryResult = await session.run(
                `${value}`,
                object
            )
            return queryResult;
        } catch (error) {
            console.log("queryError:", error)
        } finally {
            session.close();
        }
    }
}

export function createNeoHandler() { return new neoHandler};


