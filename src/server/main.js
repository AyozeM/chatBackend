import bodyParser from 'body-parser';
import cookie from "cookie";
import cors from 'cors';
import express from 'express';
import { Server } from "http";
import mongoose from 'mongoose';
import socketio from 'socket.io';
import config from '../config/config.json';
import loginController from '../controllers/loginController';

const session = {};
const app = express();
const router = express.Router();
const server = Server(app);
const io = socketio(server);

const messages = [
    {
        user: 'machine',
        text: 'test message'
    }
];

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const sendMessages = () =>{
    io.sockets.emit('messages',messages);
}

io.on('connection', (socket,req) => {
    console.log(req);
    console.log('WebSocket connection was successfully', new Date());
    sendMessages();

    socket.on('newMessage', message => {
        console.log('nuevo mensaje recibido', new Date());
        messages.push(message)
        sendMessages();
    })
});

mongoose.connect(`mongodb://${config.dbUrl}`,(err,res) =>{
    if(err) throw err;
    console.log('Database conection was successfully');
})

server.listen(config.port, () => {
    loginController(app,session);
    console.log(`Server is running at http://localhost:${config.port}`);
})
