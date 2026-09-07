const sendEmail = require('../email.js');
const { subscribeToQueue } = require('./broker.js');

// ✅ async add karo
module.exports = async function () {
    // ✅ await add karo
    await subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
        console.log("✅✅✅ DATA RECEIVED! ✅✅✅",data);

        // Email send
        const emailHTMLTemplate = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333333; margin-bottom: 20px;">Welcome to Our Site 🎉</h1>
                    <p style="font-size: 16px; color: #555555;">
                        Dear <strong>${data.fullName?.firstName || ''} ${data.fullName?.lastName || ''}</strong>,
                    </p>
                    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                        Thank you for creating an account with us.
                        We are excited to have you as a part of our community.
                    </p>
                    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                        Your account has been successfully created.
                        You can now explore our website and enjoy our services.
                    </p>
                    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                        If you have any questions, feel free to contact our support team.
                    </p>
                    <p style="font-size: 16px; color: #555555; margin-top: 30px;">
                        Best regards,<br />
                        <strong>The Team</strong>
                    </p>
                </div>
            </div>
        `;
        
        await sendEmail(data.email, "Welcome to our Service", "Thank you for registering with us", emailHTMLTemplate)
    })
}