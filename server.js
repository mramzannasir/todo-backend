import { app } from "./app.js";
import connectDb from "./database/db.js";


connectDb()


app.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`);
})