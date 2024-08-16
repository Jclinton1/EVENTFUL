const mongoose = require("mongoose")
const CONFIG = require("../config/config")
import logger from"../logging/logger"

 export function connectToDb() {
    mongoose.connect(CONFIG.MONGODB_URL)

    mongoose.connection.on("connected", () => {
        logger.info("Mongodb connected successfully")
    })

    mongoose.connection.on("error", (err: any) => {
        logger.error(err)

    })
}

export default CONFIG