const express = require("express");
const upload = require("../middleware/multer");

const {
  addProduct,
  getAllProducts,
  getOne,
  updateProduct,
  deleteProduct,
  secondUpdate,
  thirdUpdate,
} = require("../controller/productController");

const router = express.Router();

router.post("/create", upload.array("images", 5), addProduct);
router.get("/getAll", getAllProducts);
router.get("/getOne/:productId", getOne);
router.put("/update/:productId", upload.array("images", 5), updateProduct);
router.delete("/delete/:productId", deleteProduct);
router.put("/updateTwo/:productId", secondUpdate);
router.put("/updateThree/:productId", thirdUpdate);

module.exports = router;
