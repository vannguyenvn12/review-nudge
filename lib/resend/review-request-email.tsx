/**
 * React Email template for review request emails.
 * Rendered server-side and passed to resend.emails.send() via the `react` param.
 *
 * Props:
 *   customerName — recipient's first/full name
 *   businessName — sender's business name shown in copy
 *   trackingUrl  — /api/track/[reviewRequestId] endpoint; records the click
 *                  then redirects to the business's Google review page
 */

interface ReviewRequestEmailProps {
  customerName: string;
  businessName: string;
  trackingUrl: string;
}

export function ReviewRequestEmail({
  customerName,
  businessName,
  trackingUrl,
}: ReviewRequestEmailProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>How did we do?</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f4f4f5",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: "#f4f4f5", padding: "40px 16px" }}
        >
          <tbody>
            <tr>
              <td align="center">
                {/* Card */}
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    maxWidth: 520,
                    backgroundColor: "#ffffff",
                    borderRadius: 12,
                    padding: "40px 40px 32px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <tbody>
                    {/* Heading */}
                    <tr>
                      <td>
                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: 22,
                            fontWeight: 700,
                            color: "#18181b",
                            lineHeight: 1.3,
                          }}
                        >
                          Hi {customerName} 👋
                        </p>
                        <p
                          style={{
                            margin: "0 0 24px",
                            fontSize: 15,
                            color: "#52525b",
                            lineHeight: 1.6,
                          }}
                        >
                          Thank you for choosing <strong>{businessName}</strong>. We
                          hope everything went smoothly! If you have a moment, we'd
                          really appreciate a quick Google review — it helps us a lot.
                        </p>
                      </td>
                    </tr>

                    {/* CTA button */}
                    <tr>
                      <td align="center" style={{ paddingBottom: 28 }}>
                        <a
                          href={trackingUrl}
                          style={{
                            display: "inline-block",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            fontSize: 15,
                            fontWeight: 600,
                            textDecoration: "none",
                            borderRadius: 8,
                            padding: "12px 28px",
                          }}
                        >
                          Leave a Google Review ⭐
                        </a>
                      </td>
                    </tr>

                    {/* Fallback link */}
                    <tr>
                      <td>
                        <p
                          style={{
                            margin: "0 0 24px",
                            fontSize: 13,
                            color: "#a1a1aa",
                            textAlign: "center",
                          }}
                        >
                          Button not working?{" "}
                          <a
                            href={trackingUrl}
                            style={{ color: "#2563eb", textDecoration: "underline" }}
                          >
                            Click here
                          </a>
                        </p>
                      </td>
                    </tr>

                    {/* Divider */}
                    <tr>
                      <td>
                        <hr
                          style={{
                            border: "none",
                            borderTop: "1px solid #e4e4e7",
                            margin: "0 0 20px",
                          }}
                        />
                        <p
                          style={{
                            margin: 0,
                            fontSize: 12,
                            color: "#a1a1aa",
                            textAlign: "center",
                          }}
                        >
                          You received this email because you recently worked with{" "}
                          <strong>{businessName}</strong>. If this was a mistake, you
                          can ignore this email.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
