const user = require('../models/document');
const mongoose = require('mongoose');

exports.index_get = (req, res, next) => {
    res.render('index');
}

exports.index_post = (req, res, next) => {

    try {
        const rawText = req.body.paragraphs;
        var output = rawText.split(/(?:\r\n){2,}/);

        output.forEach(element => {
            const paragraph = new user({
                text: element,
                tags: element.toLowerCase().split(/\s/g)
            });

            paragraph.save().then().catch(error => {
                return res.status(404).json({
                    message: "Something went wrong",
                    error
                });
            });
        });

        res.status(200).render('index');

    } catch (error) {
        console.log(error);
    }
}

exports.search_get = (req, res, next) => {
    try {

        user.collection.createIndex({ tags: 'text' });
        res.status(200).render('search', {
            paragraphs: [{
                "text": "Nothing to show here."
            }]
        });
        next();
    } catch (error) {
        console.log(error);
    }
}

exports.search_post = (req, res, next) => {
    try {
        const query = req.body.query;
        user.find({
            $text: {
                $search: query
            }
        }, {
            score: {
                $meta: 'textScore'
            }
        }).sort({
            score: {
                $meta: 'textScore'
            }
        }).select('_id text').limit(10).exec().
            then(paragraphs => {
                if (paragraphs.length === 0) {
                    res.status(200).render('search', {
                        paragraphs: [{
                            "text": "Not found."
                        }]
                    });
                } else {
                    res.status(200).render('search', {
                        paragraphs: paragraphs
                    });
                }
            }).catch(error => {
                return res.status(404).json({
                    message: "Something went wrong",
                    error
                });
            });
    } catch (error) {
        console.log(error);
    }
}

exports.clear_get = (req, res, next) => {
    try {
        user.deleteMany({}).exec().then(paragraphs => {
            res.status(200).render('clear');
        }).catch(error => {
            res.status(404).json({
                message: "Something went wrong",
                error
            });
        });
        user.collection.drop();
    } catch (error) {
        console.log(error);
    }
}