const http = require('http');
const crypto = require('crypto');

const port = 8080;
const secret = process.argv[2];

/**
 * TODO: doc this
 */

http.createServer(function(req, res) {
    console.log('Request received');

    req.on('data', function(chunk) {
        console.log('Data event');

        if(secret) {
            console.log('Secret provided, checking signature');
            let sig = `sha1=${crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex')}`;

            if (req.headers['x-hub-signature'] !== sig) return;
        }

        console.log('Pulling from github');
        exec('git pull');
        console.log('Pulled from github');

        // exec('npm run ');
    });

    res.end();
}).listen(port);

console.log(`Listening on port ${port} for webhook events.`);
