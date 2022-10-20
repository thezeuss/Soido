const  nodemailer = require("nodemailer");

const mailHelper = async ( data ) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER, // generated ethereal user
          pass: process.env.SMTP_PASS, // generated ethereal password
        },
      });

      const message = {
        from: 'parthdarji2002@gmail.com', // sender address
        to: data.email, // list of receivers
        subject: data.object, // Subject line
        text: data.message, // plain text body
        // html: "<b>Hello world?</b>", // html body
      }
  // send mail with defined transport object
   await transporter.sendMail(message);

  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);



module.exports = mailHelper;