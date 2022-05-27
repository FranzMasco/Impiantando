/**
 * Project: Impiantando
 * API implementation: News
*/

const express = require('express');
const { response } = require('../app');
const tokenChecker = require('./tokenChecker.js');
const router = express.Router();
const News = require('../models/news');

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
 router.get('/news', async (req, res) => {
    let news = await News.find({});
    let response = news.map( (single_news) => {
        return {
            self: "/api/v2/news/" + single_news.id,
            text: single_news.text,
            course_id: single_news.course_id,
            course: "/api/v2/news/" + single_news.course_id,
            pubblication_date: single_news.pubblication_date
        };
    });
    res.status(200).json(response);
});

router.post('/news', tokenChecker);
router.post('/news', async (req, res) => {
    let news_text = req.body.text;
    let course_id = req.body.course_id;
    let pubblication_date = req.body.pubblication_date;

    let news = new News({
        text: news_text,
        course_id: course_id,
        pubblication_date: pubblication_date
    });

    await news.save();

    let news_id = news.id;

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
    */
    res.location("/api/v2/news/" + news_id).status(201).send();    
});

router.get('/news/:id', async (req, res) => {
    let news = await News.findOne({'_id':req.params.id});

    if (!news) {
        res.status(404).send()
        console.log('resource not found')
        return;
    }

    let response = {
            self: "/api/v2/news/" + news.id,
            text: news.text,
            course_id: news.course_id,
            course: "/api/v2/news/" + news.course_id,
            pubblication_date: news.pubblication_date
        };
    res.status(200).json(response);
});


router.delete('/news/:id', tokenChecker);
router.delete('/news/:id', async (req, res) => {
    let news = await News.findById(req.params.id).exec();
    if (!news) {
        res.status(404).json({status: "error"})
        console.log('resource not found')
        return;
    }
    await news.deleteOne()
    res.status(204).json({status: "success"});
});

router.patch('/news/:id', tokenChecker);
router.patch('/news/:id', async (req, res) => {
    News.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((news) => {
        if (!news) {
            return res.status(404).send();
        }
        res.status(200).send(news);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

module.exports = router