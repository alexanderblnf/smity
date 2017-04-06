const nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();

router.post('/send', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var message = req.body.message;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'smity.mailserver@gmail.com',
            pass: 'Iamsmity1*'
        }
    });

// setup email data with unicode symbols
    var mailOptions = {
        from: name + ' <' + email + '>' , // sender address
        to: 'andradenis.ionescu@gmail.com', // list of receivers
        subject: 'Hello', // Subject line
        text: 'Message: ' + message + '\nEmail: ' + email + '\nPhone:' + phone, // plain text body
        html: 'Message:\n' + message + '<br>Email: ' + email + '<br>Phone: ' + phone // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.send('success');
    });
});

module.exports = router;