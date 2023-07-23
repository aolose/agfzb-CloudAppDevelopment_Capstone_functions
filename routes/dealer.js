var express = require('express');
var router = express.Router();

const {CloudantV1} = require('@ibm-cloud/cloudant');
const {IamAuthenticator} = require('ibm-cloud-sdk-core');


/* GET home page. */
router.get('/', async function (req, res, next) {
    const {s} = require("./enum");
    const {state: st, dealerId: id} = req.query
    const authenticator = new IamAuthenticator({apikey: s.IAM_API_KEY})
    const cloudant = CloudantV1.newInstance({
        authenticator: authenticator
    });
    cloudant.setServiceUrl(s.COUCH_URL)
    try {
        const {result} = (st || id) ? await cloudant.postFind({
                db: "dealerships",
                selector: {st, id: id && +id},
                limit: 100
            })
            : await cloudant.postAllDocs({db: "dealerships", includeDocs: true})
        const {docs, rows} = result
        res.json(docs || rows)
    } catch (e) {
        res.json({error: error.description})
    }
});

module.exports = router;
