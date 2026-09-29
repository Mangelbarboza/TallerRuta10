namespace Taller_back.Infraestructure.Email
{
    public class SmtpOptions
    {
        public string Host { get; set; } = "";
        public int Port { get; set; } = 25;
        public bool EnableSsl { get; set; } = false;
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string From { get; set; } = "no-reply@taller.local";
        public string? FromName { get; set; }
    }
}
