const express = require("express");
const router = express.Router();
const apiRoutes = require("./api");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

const api = process.env.BASE_URL;

router.use(api, apiRoutes);

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.use(api, (req, res) =>
  res
    .status(404)
    .json({ success: false, message: "No Api Found On This Route Location" }),
);

module.exports = router;
