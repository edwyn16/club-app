import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Club LMS API running on port ${PORT}`);
})