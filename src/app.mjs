import { getUsers, addUser } from "./models/user.mjs";
import { createServer } from "http";

const PORT = 3000;

const parseBody = async (req) => {

    return new Promise((resolve, reject) => {
        let body ="";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            try{
                resolve(JSON.parse(body));
            }catch (e) {
                reject(new Error('Invalid JSON '));
            }
        })
    })
};

const server = createServer(async (req, res) => {
    const { method, url } = req;

    switch (true) {
        case url === '/api/users' && method === 'GET': {
            const users = getUsers();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
            break;
        }
        case url === '/api/users' && method === 'POST': {
            const body = await parseBody(req);
            addUser(body);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('User added');
            break;
        }
        default: {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }
});

server.listen(PORT, () => {
    console.log(`Started on address: http://localhost:${PORT}`);
});
