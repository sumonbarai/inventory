/* eslint-disable no-console */
const app = require("./app/app");
const { PORT } = require("./secret");
const connectDb = require("./src/db/db");

const port = PORT || 5000;

// database connection
connectDb()
  .then((res) => {
    console.log(
      `MongoDB connected successfully!! DB HOST: ${res.connection.host}`
    );
    // now start to server
    app.listen(port, () => {
      console.log(`server is running http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("database connection failed");
    process.exit(1);
  });
