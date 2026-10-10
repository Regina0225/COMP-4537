const http = require("http");
const fs = require("fs");
const path = require("path");
const Utils = require("./modules/utils");
const MESSAGES = require("./lang/en/en");

class DateHandler {
    constructor() {
        this.utils = new Utils();
    }

    handle(url, res) {
        const name = url.searchParams.get("name");
        const currentDate = this.utils.getDate();

        const message = MESSAGES.greeting.replace("%1", name);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`<p style="color: blue;">${message} ${currentDate}</p>`);
    }
}

class FileHandler {
    constructor() {
        this.filePath = path.join(__dirname, "file.txt");
    }

    writeFile(url, res) {
        const text = url.searchParams.get("text");

        fs.appendFile(this.filePath, text + "\n", (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error writing to file");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(`${text} was added to file.txt`);
        });
    }

    readFile(filename, res) {
        const filePath = path.join(__dirname, filename);

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end(`404: ${filename} not found`);
                return;
            }

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(data);
        });
    }
}

class Server {
    constructor(port) {
        this.port = port;
        this.dateHandler = new DateHandler();
        this.fileHandler = new FileHandler();
    }

    start() {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, "0.0.0.0", () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    handleRequest(req, res) {
        const url = new URL(req.url, `http://${req.headers.host}`);

        if (url.pathname === "/COMP4537/labs/4/getDate/") {
            this.dateHandler.handle(url, res);

        } else if (url.pathname === "/COMP4537/labs/4/writeFile/") {
            this.fileHandler.writeFile(url, res);

        } else if (url.pathname.startsWith("/COMP4537/labs/4/readFile/")) {
            const filename = url.pathname.split("/").pop();
            this.fileHandler.readFile(filename, res);

        } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
        }
    }
}

const port = process.env.PORT || 8080;
const server = new Server(port);
server.start();