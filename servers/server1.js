import 'dotenv/config';  // Load env first
import express from 'express';
const app = express();


const PORT = 3000;

app.get('/', (req, res) => {   
    // res.send(`Response from Server 1 on port ${PORT}`);
    res.json({
        server: 1,
        port: PORT,
        message: `Response from Server 1 on port ${PORT}`,
        timeStamp: new Date().toISOString()
    } );
}  );


app.listen(PORT, () => {
    console.log(`Server 1 is running on port ${PORT}`);
}   );  