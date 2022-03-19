const http = require('http');
let crypto = require('crypto');

http.createServer(function(req, res) {
    req.on('data', function(chunk) {
        let sig = `sha1=${crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex')}`;

        if (req.headers['x-hub-signature'] === sig) {
            exec('git pull');
            console.log('pulled from github');
            // exec('npm run ');
        }
    });

    res.end();
}).listen(8080);
