const bodyParser = require('body-parser');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const swaggerFile = require('./swagger_output.json');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3005';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use(routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(PORT, () => {
  console.log('Online');
});
