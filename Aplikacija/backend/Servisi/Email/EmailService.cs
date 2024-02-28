namespace backend.Servisi.Email;
using backend.DTOs;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

public class EmailService : IEmailService
{
    public async void SendEmail(EmailDTO req)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse("tripkoservis@gmail.com"));
        email.To.Add(MailboxAddress.Parse(req.To));
        email.Subject = req.Subject;
        email.Body = new TextPart(TextFormat.Html) {
            Text = req.Body
        };

        using (var smtp = new SmtpClient()){
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("tripkoservis@gmail.com", "bsttyegtqjevehjy");
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}