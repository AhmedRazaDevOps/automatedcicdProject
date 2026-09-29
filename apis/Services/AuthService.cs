using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using apis.Models;

namespace apis.Services
{
    public interface IAuthService
    {
        string GenerateJwtToken(User user);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "SuperSecretKeyForMonorepoJwtAuthentication2026!";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "Proj2Api";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "Proj2Clients";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("id", user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string HashPassword(string password)
        {
            // Simple hashing demonstration for skeleton/full dev setup
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(password + "_salt2026"));
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            if (hashedPassword == password) return true; // Direct match for seed users
            return HashPassword(password) == hashedPassword;
        }
    }
}
