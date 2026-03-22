using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Taller_back.Application.Interface;

namespace Taller_back.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestEmailController : ControllerBase
    {
        private readonly IEmailSender _emailSender;
        private readonly ILogger<TestEmailController> _logger;

        public TestEmailController(IEmailSender emailSender, ILogger<TestEmailController> logger)
        {
            _emailSender = emailSender;
            _logger = logger;
        }

        public class EmailTestRequest
        {
            public string To { get; set; }
            public string Subject { get; set; }
            public string Body { get; set; }
        }

        [HttpPost("email")]
        public async Task<IActionResult> SendTestEmail([FromBody] EmailTestRequest req)
        {
            if (req == null)
                return BadRequest("Request body is required.");

            if (string.IsNullOrWhiteSpace(req.To))
                return BadRequest("Recipient 'To' is required.");

            try
            {
                _logger.LogInformation("Test email request: To={To}, Subject={Subject}", req.To, req.Subject);

                // Await the send so caller can know when the attempt finished
                await _emailSender.SendEmailAsync(req.To, req.Subject ?? "Prueba", req.Body ?? "Test message");

                return Ok(new { message = "Email send attempted. Check application logs and SMTP provider dashboard." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when attempting to send test email to {To}", req.To);
                return StatusCode(500, new { error = "Error sending email", detail = ex.Message });
            }
        }
    }
}
