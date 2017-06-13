var functions = require('firebase-functions');
var nodemailer = require('nodemailer');

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) = > {
        response.send("你好，这是测试数据!");
})
;


// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.database.ref('/users/{uid}').onWrite(event = > {
        const snapshot = event.data;
const val = snapshot.val();

if (!snapshot.changed('subscribedToMailingList')) {
    return;
}

const mailOptions = {
    from: '"Spammy Corp." <noreply@firebase.com>',
    to: val.email
};

// The user just subscribed to our newsletter.
if (val.subscribedToMailingList) {
    mailOptions.subject = 'Thanks and Welcome!';
    mailOptions.text = 'Thanks you for subscribing to our newsletter. You will receive our next weekly newsletter.';
    return mailTransport.sendMail(mailOptions).then(() = > {
            console.log('New subscription confirmation email sent to:', val.email);
}).
    catch(error = > {
        console.error('There was an error while sending the email:', error);
})
    ;
}

// The user unsubscribed to the newsletter.
mailOptions.subject = 'Sad to see you go :`(';
mailOptions.text = 'I hereby confirm that I will stop sending you the newsletter.';
return mailTransport.sendMail(mailOptions).then(() = > {
        console.log('New unsubscription confirmation email sent to:', val.email);
}).
catch(error = > {
    console.error('There was an error while sending the email:', error);
})
;
})
;

