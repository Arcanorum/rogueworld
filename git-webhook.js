const http = require('http');
const crypto = require('crypto');

const port = 8080;

http.createServer(function(req, res) {
    req.on('data', function(chunk) {
        console.log('Data received');
        let sig = `sha1=${crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex')}`;

        if (req.headers['x-hub-signature'] === sig) {
            exec('git pull');
            console.log('Pulled from github');
            // exec('npm run ');
        }
    });

    res.end();
}).listen(port);

console.log(`Listening on port ${port} for webhook events.`);
