var express = require('express');
var router = express.Router();
const {CloudantV1} = require('@ibm-cloud/cloudant');
const {IamAuthenticator} = require('ibm-cloud-sdk-core');

/* GET users listing. */
router.all('/', async function (req, res, next) {
    const {s} = require("./enum");
    const __ow_method = req.method
    const {review, dealerId} = req.params
    const authenticator = new IamAuthenticator({apikey: s.IAM_API_KEY})
    const cloudant = CloudantV1.newInstance({
        authenticator: authenticator
    });
    cloudant.setServiceUrl(s.COUCH_URL);
    if (/post/i.test(__ow_method)) {
        const doc = review;
        const id = doc.id || Date.now()
        try {
            cloudant.postDocument({db: "reviews", document: doc})
            return {"body": id};
        } catch (error) {
            res.json({error: error.description})
        }
    } else {
        const id = parseInt(dealerId)
        try {
            const {result: {docs}} = await cloudant.postFind({
                db: "reviews", selector: {dealership: id},
            })
            res.json(docs)
        } catch (error) {
            res.json({error: error.description})
        }
    }
});

module.exports = router;
