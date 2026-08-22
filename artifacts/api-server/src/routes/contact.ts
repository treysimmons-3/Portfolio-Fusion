import { Router } from "express";
import { Resend } from "resend";
import { logger } from "../lib/logger";

const router = Router();

router.post("/contact", async (req, res) => {
  const { name, email, budget, message } = req.body as {
    name?: string;
    email?: string;
    budget?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    res.status(400).json({ error: "Name, email, and message are required." });
    return;
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    logger.error("RESEND_API_KEY is not set");
    res.status(500).json({ error: "Email service is not configured." });
    return;
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["3simmons@gmail.com"],
      replyTo: email,
      subject: `New project idea from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Budget / timing: ${budget || "—"}`,
        "",
        message,
      ].join("\n"),
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Budget / timing:</strong> ${budget || "—"}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      logger.error({ error }, "Resend API error");
      res.status(500).json({ error: "Failed to send email. Please try again." });
      return;
    }

    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Unexpected error sending email");
    res.status(500).json({ error: "Failed to send email. Please try again." });
  }
});

export default router;
