const express = require('express');
const app = express();

app.use(express.static('code'));

app.listen(3000, () => console.log('app running'));
