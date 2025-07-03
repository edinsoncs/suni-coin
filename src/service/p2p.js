import WebSocket from 'ws';
import https from 'https';
import fs from 'fs';

const {
  P2P_PORT = 6000,
  PORTS,
  WSS_KEY_PATH,
  WSS_CERT_PATH,
  P2P_AUTH_TOKEN = '',
} = process.env;
const ports = PORTS ? PORTS.split(',') : [];
const MESSAGE = {
        BLOCKS: 'blocks',
        TR: 'transaction' ,
        WIPE: 'wipe_memorypool',
        AUTH: 'auth'
};


class P2PAction{

        constructor(blockchain){
                this.blockchain = blockchain;
                this.sockets = [];
                this.authToken = P2P_AUTH_TOKEN;
                this.tlsOptions = {};
                if (WSS_KEY_PATH && WSS_CERT_PATH) {
                        this.tlsOptions.key = fs.readFileSync(WSS_KEY_PATH);
                        this.tlsOptions.cert = fs.readFileSync(WSS_CERT_PATH);
                }
        }

        listen(){
                let wss;
                if (this.tlsOptions.key && this.tlsOptions.cert) {
                        const httpsServer = https.createServer(this.tlsOptions);
                        wss = new WebSocket.Server({ server: httpsServer });
                        httpsServer.listen(P2P_PORT);
                } else {
                        wss = new WebSocket.Server({ port: P2P_PORT });
                }
                wss.on('connection', (socket) => this.handleIncoming(socket));

                ports.forEach((port) => {
                        const socket = new WebSocket(port, {
                                rejectUnauthorized: false,
                        });
                        socket.on('open', () => {
                                socket.send(JSON.stringify({ type: MESSAGE.AUTH, value: this.authToken }));
                                this.initSocket(socket);
                        });
                });

                console.log(`wss:port => ${P2P_PORT}`);
        }

        handleIncoming(socket){
                socket.once('message', (message) => {
                        let data;
                        try {
                                data = JSON.parse(message);
                        } catch (err) {
                                socket.close();
                                return;
                        }

                        if (data.type !== MESSAGE.AUTH || data.value !== this.authToken) {
                                socket.close();
                                return;
                        }

                        this.initSocket(socket);
                        socket.send(JSON.stringify({ type: MESSAGE.BLOCKS, value: this.blockchain.blocks }));
                });
        }

        initSocket(socket){
                const { blockchain } = this;
                this.sockets.push(socket);

                console.log('Socket conectado');

                socket.on('message', (message) => {
                        const { type, value } = JSON.parse(message);

                        try {
                                if (type === MESSAGE.BLOCKS) blockchain.replace(value);
                                else if (type === MESSAGE.TR) blockchain.memoryPool.addOrUpdate(value);
                                else if (type === MESSAGE.WIPE) blockchain.memoryPool.wipe();

                        } catch (err) {
                                console.log(`ws_error ${err}`);
                        }

                });
        }

	sync() {
		const { blockchain : {blocks} } = this;
		this.broadcast(MESSAGE.BLOCKS, blocks);
	}

	broadcast(type, value){
		console.log(`broadcast ${type}...`, value);
		const message = JSON.stringify({type,value});
		this.sockets.forEach((socket) => socket.send(message));
	}


}

export { MESSAGE };

export default P2PAction
