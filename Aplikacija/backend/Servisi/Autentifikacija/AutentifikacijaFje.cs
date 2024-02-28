using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace backend.Servisi.Autentifikacija;

public class AutentifikacijaFje
{
    private readonly IConfiguration _config;
    public AutentifikacijaFje(IConfiguration configuration)
    {
        _config = configuration;
    }
    public string HesirajPassword(string pass){
        return BCrypt.Net.BCrypt.HashPassword(pass);
    }
    public bool ProveriPassword(string pass, string passHash){
        return BCrypt.Net.BCrypt.Verify(pass, passHash);
    }

    public string GenerisiToken(Turista turista){
        List<Claim> claims = new List<Claim>{
            new Claim(ClaimTypes.Name, turista.Id.ToString()),
            new Claim(ClaimTypes.Email, turista.Email),
            new Claim(ClaimTypes.Role, turista.TipNaloga)
        };
        var kljuc = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value!));
        
        var cred = new SigningCredentials(kljuc, SecurityAlgorithms.HmacSha512Signature);

        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: cred
        );

        string jwt = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }
}