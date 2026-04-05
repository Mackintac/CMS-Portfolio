// src/app/api/contact/route.ts
// ─── Contact form — sends email via Resend ────────────────────────────────────

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import type { ContactPayload } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",   // replace with your verified domain
      to: ["hello@yourportfolio.dev"],
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px;">
          <h2 style="margin-bottom: 4px;">New portfolio message</h2>
          <p style="color: #666; margin-top: 0;">From ${name} &lt;${email}&gt;</p>
          <hr />
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/contact] error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
