const http = require('http');
const url = require("url");
const fs = require("fs");

const port = 3000;
const server = http.createServer(onRequest);
console.log("Server is running on port: " + port);
server.listen(port);

function onRequest(req, res){
    let path = url.parse(req.url).pathname;
    if(path === "/"){
        path = "/html/index.html";
    }
    console.log("./PublicResources"+path);
    fs.readFile("./PublicResources" + path, function(error, data){
        let file = getExt(path);
        if(error){
            res.writeHeader(404, {"Content-Type": "text/plain"});
            res.write(error);
        }
        if (file === "css") {
            res.writeHeader(200, {"Content-Type": "text/css"});
            res.write(data);
        }
        else if (file === "js") {
            res.writeHeader(200, {"Content-Type": "text/javascript"});
            res.write(data);
        }
        else {
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write(data);
        }
        res.end();
    });
}
function getExt(path){
    if(path === "/"){
        return path;
    }
    else if(path === undefined){
        return path;
    }
    return path.split(".")[1];
}
