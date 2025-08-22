import app from './index.js'
import dotenv from "dotenv";
import { dbConnnection } from "./db/index.js";
// import  BLOG_DATA  from './controller/host.controller';
dotenv.config({ path: './.env' })
const port = process.env.PORT || 3001;

dbConnnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`the server is runing on http://localhost:${port}`);

        })
        app.on('error', (error) => {
            console.log('server connection is fail', error);
        })

    })
    .catch((error) => {
        console.log('database connection is fail', error);

    })
