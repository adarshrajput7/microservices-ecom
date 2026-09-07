require('dotenv').config();
const app = require('./src/app.js');





app.listen(3006, () => {
    console.log('Notification server started on 3006');
});
