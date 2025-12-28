import express from 'express';

const app = express();
const PORT = 3002;

app.get('/', (req, res) => {

    // res.send(`Response from Server 3 on port ${PORT}`);
    res.json({
        server: 3,
        port: PORT,
        message: `Response from Server 3 on port ${PORT}`,
        timeStamp: new Date().toISOString()
    });
}
);
app.listen(PORT, () => {
    console.log(`Server 3 is running on port ${PORT}`);
}   );