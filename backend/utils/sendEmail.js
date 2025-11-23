const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, text) {
  try {
    const response = await resend.emails.send({
      from: "Expense Tracker <onboarding@resend.dev>",
      to,
      subject,
      html: `<p>${text}</p>`,
    });

    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Resend email error:", error);
    throw error;
  }
}

module.exports = sendEmail;
