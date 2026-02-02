const nodemailer = require("nodemailer");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(
      appError.create("All fields are required", 400, httpStatus.FAIL),
    );
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `رسالة جديدة من ${name} | New Contact Message`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #1a73e8;">رسالة جديدة من نموذج التواصل | New Contact Message</h2>
        <p>لقد وصلتك رسالة جديدة من موقع البورتفوليو.</p>

        <h3>تفاصيل المرسل | Sender Details:</h3>
        <ul>
          <li><strong>الاسم | Name:</strong> ${name}</li>
          <li><strong>البريد الإلكتروني | Email:</strong> ${email}</li>
        </ul>

        <h3>نص الرسالة | Message:</h3>
        <p style="background: #f9f9f9; padding: 10px; border-left: 4px solid #1a73e8;">
          ${message}
        </p>

        <hr>
        <p style="font-size: 12px; color: #777;">
          تم إرسال هذه الرسالة تلقائيًا من موقع البورتفوليو | This message was sent automatically from Portfolio website.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "Email sent successfully",
    });
  } catch (err) {
    return next(appError.create("Failed to send email", 500, httpStatus.ERROR));
  }
};

module.exports = { sendContactEmail };
