import express from 'express';
import routes from './routes/routes.js';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT, HOSTNAME } from './config.js';
import { swaggerDocs, swaggerUi } from './swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/bestburger', routes);
app.use("/icon", express.static(path.join(__dirname, './icons')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.static(path.resolve("public")));

http.createServer(app).listen(PORT, HOSTNAME, () => {  
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    console.log(`Documentación Swagger disponible en http://${HOSTNAME}:${PORT}/api-docs`);
});
