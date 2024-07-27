import { app } from "./app.js";
import { connectDB } from "./utils/connectDB.js";
connectDB();
app.listen(3000, () => console.log("Server is running on port 3000..."));
