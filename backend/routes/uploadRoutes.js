const express = require("express");
const { upload } = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

module.exports = router;
