const http = require('http');

const data = {
    name: "node.js",
    type: "Runtime",
    language: "JavaScript",
};

const server = http.createServer((req, res) => {
    if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('API server running at http://localhost:3000');
});