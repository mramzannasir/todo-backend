import { app } from "./app.js";
import { connectDB } from "./utils/connectDB.js";
connectDB();
app.listen(4040, () => console.log("Server is running on port 4040..."));
