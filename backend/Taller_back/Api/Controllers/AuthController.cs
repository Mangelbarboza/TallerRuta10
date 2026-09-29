using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Taller_back.Infraestructure;

namespace Taller_back.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDBContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // POST: /api/Auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest model)
        {
            if (model is null || string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Password))
                return BadRequest(new { message = "Username y Password son requeridos." });

            var inputUser = model.Username.Trim();
            var admin = _context.Admins.FirstOrDefault(a =>
                a.Name == inputUser || a.Email == inputUser
            );

            if (admin == null)
            {
                return Unauthorized(new { message = "Usuario o contraseña incorrectos" });
            }

            bool passwordMatches = false;
            if (!string.IsNullOrEmpty(admin.Password) && admin.Password.StartsWith("$2"))
            {
                try
                {
                    passwordMatches = BCrypt.Net.BCrypt.Verify(model.Password, admin.Password);
                }
                catch
                {
                    passwordMatches = false;
                }
            }
            else
            {
                passwordMatches = admin.Password == model.Password;
            }

            if (!passwordMatches)
                return Unauthorized(new { message = "Usuario o contraseña incorrectos" });

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, admin.AdminId.ToString()),
                new Claim(ClaimTypes.Name, admin.Name),
                new Claim(ClaimTypes.Email, admin.Email ?? ""),
                new Claim("IsAdmin", "true")
            };

            var jwtKey = _config["Jwt:Key"];
            var jwtIssuer = _config["Jwt:Issuer"];
            var jwtAudience = _config["Jwt:Audience"];

            if (string.IsNullOrWhiteSpace(jwtKey) ||
                string.IsNullOrWhiteSpace(jwtIssuer) ||
                string.IsNullOrWhiteSpace(jwtAudience))
            {
                return StatusCode(500, new { message = "Configuración JWT incompleta (Jwt:Key/Issuer/Audience)." });
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddHours(8);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = expires
            });
        }

        [HttpGet("generate-hash")]
        public IActionResult GenerateHash(string password)
        {
            var hash = BCrypt.Net.BCrypt.HashPassword(password);
            return Ok(hash);
        }
    }

    public record LoginRequest(string Username, string Password);
}