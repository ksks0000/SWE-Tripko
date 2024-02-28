namespace backend.DTOs;

public class VodicSignUpDTO{
    public required string Ime { get; set; } = null!;
    public required string Prezime { get; set; } = null!;
    public required string Email { get; set; } = null!;
    public required string Password { get; set; } = null!;
    public required DateTime? DatumRodjenja { get; set; }
    public required string Grad { get; set; } = null!;
    public required string Drzava { get; set; } = null!;
    public required string? Pol { get; set; }
    public required string? BrojTelefona { get; set; }
    public required IFormFile Diploma { get; set; }
}