import dotenv from "dotenv";
dotenv.config({ path: './.env' })
import app from './index.js'
import { dbConnnection } from "./db/userSingup.js";
// import  BLOG_DATA  from './controller/host.controller';
const port = process.env.PORT || 3001;

dbConnnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`the server is runing on :${port}`);

        })
        app.on('error', (error) => {
            console.log('server connection is fail', error);
        })

    })
    .catch((error) => {
        console.log('database connection is fail', error);

    })
