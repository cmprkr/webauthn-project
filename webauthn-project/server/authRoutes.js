const express = require('express');
const router = express.Router();
const webauthn = require('./webauthn');

router.post('/register/start', webauthn.startRegistration);
router.post('/register/finish', webauthn.finishRegistration);
router.post('/login/start', webauthn.startLogin);
router.post('/login/finish', webauthn.finishLogin);

module.exports = router;
