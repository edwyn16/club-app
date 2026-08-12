import app from "./app.js";
import { env } from "./config/index.js";

app.listen(env.PORT, () => {
    console.log(`Club LMS API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
})