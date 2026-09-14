const express = require("express");
const router = express.Router();
const apiRoutes = require("./api");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

const api = process.env.BASE_URL;

router.use(api, apiRoutes);

// http://localhost:8000/api/v1/auth/login

swaggerDocument.basePath = api;
swaggerDocument.securityDefinitions = {
  bearerAuth: {
    type: 'apiKey',
    name: 'Authorization',
    in: 'header',
    description: 'Enter your bearer token in the format **Bearer &lt;token&gt;**'
  }
}

Object.entries(swaggerDocument.paths).forEach(([path, operations]) => {
  const requirAuthentication = 
  path === "/auth/login" || path === "/auth/profile" || path === "/adimn/" || path === "/subject/" || path === "/class/"
  if(requirAuthentication) {
    Object.values(operations).forEach((operation) => {
      operation.security = [{ bearerAuth: [] }];
    })
  }

});

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.use(api, (req, res) =>
  res
    .status(404)
    .json({ success: false, message: "No Api Found On This Route Location" }),
);

module.exports = router;
