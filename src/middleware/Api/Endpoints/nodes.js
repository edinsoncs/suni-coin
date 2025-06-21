export default (req, res) => {
    const nodes = p2pAction.sockets.map(s => {
        const addr = s._socket.remoteAddress;
        const port = s._socket.remotePort;
        return `${addr}:${port}`;
    });
    res.json(nodes);
};
