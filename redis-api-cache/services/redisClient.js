import { createClient } from "redis";

const client = createClient({url: "redis://localhost:6379"})

console.log("Connecting to Redis...");

client.on("connect", () => {
    console.log("Connected to Redis");
}   );

client.on("error", (err) => {   
    console.error("Redis Client Error", err);
}   );

await client.connect();


export { client };