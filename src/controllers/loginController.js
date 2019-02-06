import crypto from 'crypto';
import UserSchema from '../models/user';

export default (app,session) => {
    app.post('/login', async (req,res) => {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const user = await UserSchema.findOne({username,password});
            if(user){
                const timestamp = new Date().getTime();
                const rand = Math.floor(Math.random()*11);
                const sessionId = crypto.createHash('md5').update(`${timestamp.toString()}${rand.toString()}`).digest('hex');
                session[sessionId]  = timestamp;
                res.writeHead(200,{
                    'Set-Cookie':`sessionId=${sessionId}; expires=${new Date(new Date().getTime()+86409000).toUTCString()}`
                }).end('Successfully validated');
                //res.end('Successfully validated');
            }else{
                res.status(403).end('Authentication failure');
            }
        } catch (error) {
            res.status(500).end('Hubo algun tipo de error');
            throw error;
        }      
    })
}