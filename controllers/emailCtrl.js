import  nodemailer from "nodemailer"
import asyncHandler from "express-async-handler"

const sendEmail = asyncHandler(async(data, req, res)=>{
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "maximnyansa75@gmail.com",
      pass: "uqpo lean remu tzjb",
    },
  });
 
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Hey 👻" <maximnyansa75@gmail.com>', // Fix the missing '<' in the from address
        to: data.email,
        subject: data.subject,
        text: data.text,
        html: data.html,
      });
      console.log("Email sent:", info);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
  
  
  main().catch(console.error);
  

})
export default sendEmail