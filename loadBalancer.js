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

// 
async function pickupHealthyServer() {
    console.log(`Picked healthy server:`);

    for (let i = 0; i < servers.length; i++) {
        const server = getNextServer();
        const isHealthy = await healthcheck(server);
        if (isHealthy) {
            console.log(`Picked healthy server: ${server}`);
            return server;
        }
    }
    return null;
}
app.get('/', async (req, res) => {

    const healthyServer = await pickupHealthyServer();

    try {

        if (healthyServer === null) {
            res.status(503).json({ error: "All target servers are unhealthy" });
            return;
        }
        const response = await fetch(healthyServer);
        const data = await response.json();

        res.json({
            loadBalancer: `Response from Load Balancer round robin on port ${PORT}`,
            forwardedTo: healthyServer,
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
