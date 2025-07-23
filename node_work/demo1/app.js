//1. import the http module
const http = require('http');

//5. connect the html page with nodejs
const path = require('path');

//7. read file stream
const fs = require('fs');

//2. create http server
const server = http.createServer((req, res) => {
    //6. connect path 
    const filePath = path.join('D:\\HSBC\\training\\git\\demo\\', 'peopleinfo.html');
    //8. read the file
    fs.readFile(filePath, 'utf8', (err, content) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
    });
    // res.statusCode = 200;
    // res.setHeader('Content-Type','text/plain');
    // res.end('Hello from node.js\n');
});

//3. start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
});

//4. create html page







