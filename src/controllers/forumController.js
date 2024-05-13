const forumModels = require('../models/forumModels');

function Forum(req, res){

    forumModels.listarForuns().then((data) => {
        res.status(203).json(data);
    })
}

module.exports = {
    Forum
}