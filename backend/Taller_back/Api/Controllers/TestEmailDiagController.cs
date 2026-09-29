using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Sockets;
using System.Net;
using Taller_back.Infraestructure.Email;

namespace Taller_back.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestEmailDiagController : ControllerBase
    {
        private readonly ILogger<TestEmailDiagController> _logger;
        private readonly SmtpOptions _smtpOptions;

        public TestEmailDiagController(ILogger<TestEmailDiagController> logger, IOptions<SmtpOptions> smtpOptions)
        {
            _logger = logger;
            _smtpOptions = smtpOptions.Value;
        }

        [HttpGet("connectivity")]
        public async Task<IActionResult> ConnectivityCheck()
        {
            var host = _smtpOptions.Host;
            var port = _smtpOptions.Port;

            var result = new Dictionary<string, object?>();
            result["HostConfigured"] = host;
            result["PortConfigured"] = port;

            try
            {
                // DNS resolution
                var addresses = await Dns.GetHostAddressesAsync(host);
                result["DnsAddresses"] = addresses.Select(a => a.ToString()).ToArray();
            }
            catch (Exception ex)
            {
                result["DnsError"] = ex.Message;
                _logger.LogError(ex, "DNS resolution failed for {Host}", host);
            }

            try
            {
                using var tcp = new TcpClient();
                var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                var connectTask = tcp.ConnectAsync(host, port);
                var completed = await Task.WhenAny(connectTask, Task.Delay(Timeout.Infinite, cts.Token));

                if (completed == connectTask && tcp.Connected)
                {
                    result["TcpConnect"] = "Connected";
                    result["LocalEndPoint"] = tcp.Client.LocalEndPoint?.ToString();
                    result["RemoteEndPoint"] = tcp.Client.RemoteEndPoint?.ToString();
                }
                else
                {
                    result["TcpConnect"] = "Timeout or failed to connect";
                }
            }
            catch (Exception ex)
            {
                result["TcpError"] = ex.Message;
                _logger.LogError(ex, "TCP connect failed to {Host}:{Port}", host, port);
            }

            // Return SMTP config hint (mask password)
            result["SmtpConfig"] = new {
                Host = _smtpOptions.Host,
                Port = _smtpOptions.Port,
                EnableSsl = _smtpOptions.EnableSsl,
                UserName = _smtpOptions.UserName,
                From = _smtpOptions.From
            };

            return Ok(result);
        }
    }
}
