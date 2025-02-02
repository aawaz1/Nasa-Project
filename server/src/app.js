import express from 'express';
import cors from 'cors';
import path from 'path';
import api from './routes/api.js';
import dotenv from 'dotenv'


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import morgan from 'morgan';


dotenv.config();


const app = express();

app.use(cors({
    origin : "http://localhost:3000" 
}));

app.use(morgan("combined"));


app.use(express.json());
app.use(express.static(path.join(__dirname ,".." ,"public" )));
app.use('/v1' , api);


app.get('/*' ,(req, res) => {
    res.sendFile(path.join(__dirname ,".." ,"public" , "index.html" ));
})




export default app;