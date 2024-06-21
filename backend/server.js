// server.js
const express = require('express');
const app = express();
const claimsRoutes = require('./routes/claims');

app.use(express.json());
app.use('/api', claimsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
