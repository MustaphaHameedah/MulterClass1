const express = require("express");
require("./config/database");
const app = express();
app.use(express.json());
const PORT = 5990;

const productRouter = require("./route/productRoute");
app.use(productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
