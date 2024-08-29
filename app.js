import express from 'express';
import routes from './routes/routes.js';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { PORT, HOSTNAME } from './config.js'

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/bestburger', routes);  

app.use(express.static(path.resolve("public")));

http.createServer(app).listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});