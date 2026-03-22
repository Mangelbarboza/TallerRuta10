using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Taller_back.Application.Interface;

namespace Taller_back.Infraestructure.Email
{
    public class SmtpEmailSender : IEmailSender
    {
        private readonly SmtpOptions _options;
        private readonly ILogger<SmtpEmailSender> _logger;

        public SmtpEmailSender(IOptions<SmtpOptions> options, ILogger<SmtpEmailSender> logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            if (string.IsNullOrWhiteSpace(to))
            {
                _logger.LogWarning("No se envía correo: destinatario vacío.");
                return;
            }

            try
            {
                using var msg = new MailMessage();
                msg.From = new MailAddress(_options.From, _options.FromName);
                msg.To.Add(new MailAddress(to));
                msg.Subject = subject;
                msg.Body = htmlBody ?? "";
                msg.IsBodyHtml = true;

                using var client = new SmtpClient(_options.Host, _options.Port)
                {
                    EnableSsl = _options.EnableSsl,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Timeout = 10000
                };

                if (!string.IsNullOrWhiteSpace(_options.UserName))
                {
                    client.Credentials = new NetworkCredential(_options.UserName, _options.Password);
                }

                _logger.LogInformation("Enviando correo a {To} vía {Host}:{Port} (SSL={EnableSsl})", to, _options.Host, _options.Port, _options.EnableSsl);

                await client.SendMailAsync(msg);

                _logger.LogInformation("Correo enviado correctamente a {To}", to);
            }
            catch (SmtpException ex)
            {
                _logger.LogError(ex, "Error SMTP al enviar correo a {To}: {Message}", to, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al enviar correo a {To}: {Message}", to, ex.Message);
            }
        }
    }
}
