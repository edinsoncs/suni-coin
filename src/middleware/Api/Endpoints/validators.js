export default (req, res) => {
    res.json(newBlockchain.getValidators());
};
