import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import fs from 'fs'
import inlineCss from 'inline-css'
dotenv.config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "thailu220302@gmail.com",
      pass: process.env.passEmail,
    },
  });
  const sendRequestByEmail = async(customer, message) => {
    const info = await transporter.sendMail({
      from: 'harumi@gmail.com', 
      to: customer.email, 
      subject: `Harumi đã từ chối yêu cầu mở cửa hàng của bạn`, 
      html: `
      <div style="max-width: 1200px; margin: 0 auto; background-color: gray">
        <div style="background-color: gray; font-size: 17px;">
            <div style="text-align: center; padding: 20px;">
            <span style="font-size: 25px; background-color: white; font-weight: 600;">Cám ơn bạn đã quan tâm đến việc mở cửa hàng tại Harumi!</span>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 10px;">
            <span style="display: block; text-align: center;">Xin chào ${customer.firsName + customer.lastName}</span>
            <span style="display: block; text-align: center;">Harumi đã nhận được yêu cầu mở cửa hàng của bạn, nhưng bạn vẫn chưa đủ điều kiện để mở cửa hàng tại Harumi. Mong bạn thông cảm.</span>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <div style="margin-bottom: 10px;">
                <strong style="color: #0f146d;">Lý do:</strong>
                <span>${message}</span>
            </div>
            </div>

        </div>
    </div>

      `, 
    });
    console.log('send email')
};

  
export default sendRequestByEmail;