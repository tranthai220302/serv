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
  const sendEmail = async(hotel, rooms, booking, selectedRooms, body) => {
    let roomRows = '';
    rooms.forEach((room, i) => {
        roomRows += `
        <div style="margin-top: 20px;padding-left: 10px;">
            <div style="margin-bottom: 20px; font-size: 23px; font-weight: 600; color: black;">Phòng số ${i+1} </div>
            <table border="1" style="width: 100%; border: 1px solid #94c9eb; border-collapse: collapse;">
                <tr>
                    <td style="text-align: center; padding: 8px 0; font-size: 18px;color: black;"><b>Tên phòng</b></td>
                    <td style="text-align: center; padding: 5px 0;color: black;">${room.Room.name}</td>
                </tr>
                <tr>
                    <td style="text-align: center; padding: 8px 0; font-size: 18px;color: black;"><b>Mã phòng</b></td>
                    <td style="text-align: center; padding: 5px 0;color: black;">${room.id}</td>
                </tr>
                <tr>
                    <td style="text-align: center; padding: 8px 0; font-size: 18px;color: black;"><b>Mã pin</b></td>
                    <td style="text-align: center; padding: 5px 0;color: black;">${booking.pinCode}</td>
                </tr>
                <tr>
                    <td style="text-align: center; padding: 8px 0; font-size: 18px;color: black;"><b>Số lượng</b></td>
                    <td style="text-align: center; padding: 5px 0;color: black;">${selectedRooms[i].num}</td>
                </tr>
                <tr>
                    <td style="text-align: center; padding: 8px 0; font-size: 18px;color: black;"><b>Người</b></td>
                    <td style="text-align: center; padding: 5px 0;color: black;">${body.numAudults} người lớn, ${body.numChildrens} trẻ em</td>
                </tr>
                <tr>
                    <td style="text-align: center; padding: 8px 0; font-size: 18px;color: black;"><b>Tổng tiền</b></td>
                    <td style="text-align: center; padding: 5px 0;color: black;">${(selectedRooms[i].price).toLocaleString('en-US')} VND</td>
                </tr>
            </table>
        </div>
        `;
    });
    
    const info = await transporter.sendMail({
      from: 'harumi@gmail.com', 
      to: "tranthai220302@gmail.com", 
      subject: `Booking.com xin chào quý khách`, 
      html: `
      <div style="width: 800px; margin: auto;">
        <div style="background-color: #003580; padding: 5px 10px;">
            <h2 style="color: white;">Booking.com</h2>
        </div>
        <div style="margin-top: 20px; padding-left: 10px;">
            <span style="font-weight: 600; font-size: 18px; color: black;">Cảm ơn ${booking.Customer.nameBook}</span>
            <div><span style = "color: black;"> <img src="https://lh3.googleusercontent.com/proxy/57fKD5_2O-jMXM5uZGfTYj7LrijWzE0TSDIUHDXDBnEI-1I1M5K8jeTIISB1r7Q_slXu3azC3q1WYqP-KSqInSeqwJEA7wNPs716O9arNfhqyxIQqhorTWArFSKM" alt="" srcset="" style="height: 20px; margin-top: 10px;">  Phòng của bạn ở khách sạn <b>${hotel.name}</b> đã được xác nhận</span></div>
        <div> <span style = "color: black;"> <img src="https://lh3.googleusercontent.com/proxy/57fKD5_2O-jMXM5uZGfTYj7LrijWzE0TSDIUHDXDBnEI-1I1M5K8jeTIISB1r7Q_slXu3azC3q1WYqP-KSqInSeqwJEA7wNPs716O9arNfhqyxIQqhorTWArFSKM" alt="" srcset="" style="height: 20px; margin-top: 10px;">  Thời gian nhận phòng : ${booking.dateCheckIn} ${hotel.timeCheckIn}</span></div>
            <span style = "color: black;"> <img src="https://lh3.googleusercontent.com/proxy/57fKD5_2O-jMXM5uZGfTYj7LrijWzE0TSDIUHDXDBnEI-1I1M5K8jeTIISB1r7Q_slXu3azC3q1WYqP-KSqInSeqwJEA7wNPs716O9arNfhqyxIQqhorTWArFSKM" alt="" srcset="" style="height: 20px; margin-top: 10px;">  Thời gian trả phòng : ${booking.dateCheckOut} ${hotel.timeCheckOut}</span>
        </div>
        <div style="margin-top: 20px;padding-left: 10px;" >
            <span style="font-weight: 700; font-size: 24px; color: #94c9eb;">${hotel.name}</span>
            <div style="margin-top: 20px;">
                <span style="font-size: 15px; color : gray; font-style: italic;">${hotel.description}</span>
            </div>
        <div style="margin-top: 20px;">
            <span style = "color: black;"><b>Địa chỉ:</b>${hotel.Address.numberHome},${hotel.Address.ward},${hotel.Address.district},${hotel.Address.province}</span>
        </div>
            <div style="margin-top: 20px;">
                <span style = "color: black;"><b>Phone:</b> 0${hotel.HotelOwner.User.phone}</span>
            </div>
            <div style="margin-top: 20px;">
                <span style = "color: black;"><strong>Email:</strong> ${hotel.HotelOwner.User.email}</span> 
            </div>
            <div style="margin-top: 20px;">
                <img src=${hotel.Images[0]?.filename} alt="" srcset="" style="width: 32%; height: 230px;">
                <img src=${hotel.Images[1]?.filename} alt="" style="width: 32%; height: 230px;">
                <img src=${hotel.Images[2]?.filename} alt="" style="width: 32%; height: 230px;">
                <img src=${hotel.Images[3]?.filename} alt="" style="width: 32%; height: 230px;">
                <img src=${hotel.Images[4]?.filename} alt="" style="width: 32%; height: 230px;">
                <img src=${hotel.Images[5]?.filename} alt="" style="width: 32%; height: 230px;">
            </div>
        </div>
        ${roomRows}
        <div style="margin-top: 20px; text-align: center; font-size: 20px; margin-bottom: 20px; font-weight: 600; font-style: italic; color : #003580">
            <span style="font-size: 23px; font-weight: 800;color: black;">Booking.com</span> chúc quý khách có một kỳ nghỉ trọn vẹn.
        </div>
    </div>


      `, 
    });
    console.log('send email')
};

  
export default sendEmail;