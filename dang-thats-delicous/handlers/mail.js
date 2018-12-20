const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

const generateHTML = (filename, options = {}) => {
  //DIRNAME gives us the current directory
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  //Inline all the CSS with JUICe
  const inline = juice(html);
  return inline;
}

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: `Levi <noreply@wesbos.com`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  }

  //First arguement is function to make into a promise
  //Second arguement is binding the first arguement to it
  const sendMail = promisify(transport.sendMail, transport);
  //return a promise
  return sendMail(mailOptions);
}
