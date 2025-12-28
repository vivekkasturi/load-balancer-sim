import express from 'express';

const app = express();

const PORT = process.env.LOAD_BALANCER_PORT || 4000;

const servers = [
    `http://localhost:3000`,
    `http://localhost:3001`,
    `http://localhost:3002`
]
let currentIndex = 0;

// main logic for routing requests would go here
function getNextServer() {
    // Simple round-robin implementation
    const server = servers[currentIndex];
    currentIndex = (currentIndex + 1) % servers.length;
    return server
}

// healthcheck endpoint
async function healthcheck(url) {
    // In a real implementation, we would check server health here
    try {
        const response = await fetch(url);
        if (response.ok) {
            return true;
        }
        return false;

    } catch (error) {
        console.error(`Healthcheck failed for ${url}:`, error);
        return false;
    }
}


app.get('/', async (req, res) => {

    let targetServer = getNextServer();
    // In a real load balancer, here we would proxy the request to targetServer
    // below also we can implement retry logic if the server is unhealthy
    // let attempts = 0;

    // while(attempts < servers.length){
    //     const isHealthy = await healthcheck(targetServer);
    //     if(isHealthy){
    //         break;
    //     }
    //     console.log(`Server ${targetServer} is unhealthy. Trying next server.`);
    //     attempts++;
    // }
    try {


        const serverHealthyStatue = await healthcheck(targetServer);
        console.log(`Healthcheck for ${targetServer}: ${serverHealthyStatue}`);
        if (!serverHealthyStatue) {
            res.status(503).json({ error: "Target server is unhealthy" });


        }
        const response = await fetch(targetServer);
        const data = await response.json();

        res.json({
            loadBalancer: `Response from Load Balancer round robin on port ${PORT}`,
            forwardedTo: targetServer,
            backendResponse: data

        });

    } catch (error) {
        console.error("Error fetching from target server:", error);
        res.status(500).json({ error: "Failed to fetch from target server" });
        return;
    }

});

app.listen(PORT, () => {
    console.log(`Load Balancer is running on port ${PORT}`);
}
);
