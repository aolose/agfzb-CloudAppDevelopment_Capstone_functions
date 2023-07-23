var express = require('express');
var router = express.Router();
const {CloudantV1} = require('@ibm-cloud/cloudant');
const {IamAuthenticator} = require('ibm-cloud-sdk-core');

/* GET users listing. */
router.all('/', async function (req, res, next) {
    const {s} = require("./enum");
    const __ow_method = req.method.toLowerCase()[0]
    const authenticator = new IamAuthenticator({apikey: s.IAM_API_KEY})
    const cloudant = CloudantV1.newInstance({
        authenticator: authenticator
    });
    cloudant.setServiceUrl(s.COUCH_URL);
    if ('p' === __ow_method) {
        const doc = req.body.review
        const id = Date.now()
        try {
            cloudant.postDocument({db: "reviews", document: doc})
            res.json({"body": id})
        } catch (error) {
            res.json({error: error.description})
        }
    } else {
        const {dealerId} = req.query
        try {
            const data= await cloudant.postFind({
                db: "reviews", selector: {dealership: +dealerId},
            })
            console.log(data.result.docs)
            res.json({body:data?.result?.docs||[]})
        } catch (error) {
            res.json({error: error.description})
        }
    }
});

module.exports = router;
