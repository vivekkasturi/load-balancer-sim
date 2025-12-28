import express from 'express';

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {

    // res.send(`Response from Server 2 on port ${PORT}`);
    res.json({
        server: 2,
        port: PORT,
        message: `Response from Server 2 on port ${PORT}`,
        timeStamp: new Date().toISOString()
    } );
}
);
app.listen(PORT, () => {
    console.log(`Server 2 is running on port ${PORT}`);
}   );