namespace backend.Controllers;
using backend.tripko;
using backend.Servisi.Autentifikacija;
using backend.Servisi.Korisnik;
using backend.DTOs;
using System.Text.RegularExpressions;
using backend.Servisi.SlikaDiplome;
using System.Security.Claims;

[ApiController]
[Route("[controller]")]
public class AutentifikacijaController : ControllerBase
{
    public TripkoContext Context {get; set; }
    private AutentifikacijaFje _pom { get; set; }
    private KorisnikFje _korisnik {get;set;}
    private SlikaDiplome _diploma {get;set;}
    public AutentifikacijaController(TripkoContext context, IConfiguration configuration) 
    {
        Context = context;
        _pom = new AutentifikacijaFje(configuration);
        _korisnik = new KorisnikFje();
        _diploma = new SlikaDiplome();
    }

    [HttpPost("RegistracijaTurista")]
    public async Task<ActionResult> RegistracijaTurista([FromBody] Turista turista){
        try
        {
            if(turista.TipNaloga != "turista" && turista.TipNaloga != "vodic"){
                return BadRequest("Mozete kreirati nalog samo kao turista ili vodic!");
            }
            if(!Regex.IsMatch(turista.Email,
            @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z",
            RegexOptions.IgnoreCase)){
                return BadRequest("Email ne postoji!");
            }
            var postojeciTurista = await Context.Turisti!.Where(p=>p.Email == turista.Email).FirstOrDefaultAsync();
            if(postojeciTurista!= null) return BadRequest("Email je vec u upotrebi!");

            string passwordHash = _pom.HesirajPassword(turista.Password);
            turista.Password = passwordHash;
            await Context.Turisti!.AddAsync(turista);
            await Context.SaveChangesAsync();
            return Ok($"Uspesno ste kreirali nalog!");
            
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("RegistracijaVodic")]
    public async Task<ActionResult> RegistracijaVodic([FromForm] VodicSignUpDTO turista){
        try
        {
            if(!Regex.IsMatch(turista.Email,
            @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z",
            RegexOptions.IgnoreCase)){
                return BadRequest("Email ne postoji!");
            }
            var postojeciTurista = await Context.Turisti!.Where(p=>p.Email == turista.Email).FirstOrDefaultAsync();
            if(postojeciTurista!= null) return BadRequest("Email je vec u upotrebi!");

            Turista vodic = new Turista(){
                Ime = turista.Ime,
                Prezime = turista.Prezime,
                BrojTelefona = turista.BrojTelefona,
                Grad = turista.Grad,
                Drzava = turista.Drzava,
                DatumRodjenja = turista.DatumRodjenja,
                Pol = turista.Pol,
                Email = turista.Email,
                TipNaloga = "vodic"
            };
            string passwordHash = _pom.HesirajPassword(turista.Password);
            vodic.Password = passwordHash;
            await Context.Turisti!.AddAsync(vodic);
            await Context.SaveChangesAsync();
            await _diploma.DodajSlikuDiplome(vodic.Id, turista.Diploma);
            return Ok($"Uspesno ste kreirali nalog!");
            
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Prijavljivanje")]
    public async Task<ActionResult> Prijavljivanje([FromBody] TuristaLoginDTO turista){
        try{
            var postojeciTurista = await Context.Turisti!.Where(p=>p.Email == turista.Email).FirstOrDefaultAsync();
            if(postojeciTurista == null) return BadRequest("Email ne postoji!");
            if(!_pom.ProveriPassword(turista.Password, postojeciTurista.Password)){
                return BadRequest("Password nije dobar!"); // zbog sigurnosti mogli bi da promenimo error poruku da neko ne bi bruteforceovao
            }

            string token = _pom.GenerisiToken(postojeciTurista);
            return Ok($"{token}");
        }
        catch (Exception e){
            return BadRequest("Javila se greska: " + e.Message);
        }
    }
    [HttpDelete("ObrisiLicniProfil"), Authorize]
    public async Task<ActionResult> ObrisiLicniProfil(){ // mozda nije najsigurnije ali radi :D
        var id = _korisnik.GetCurrentUserID(User);
        try
        {
            var korisnik=await Context.Turisti!.FindAsync(id);
            if(korisnik!=null)
            {
                Context.Turisti!.Remove(korisnik);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno izbrisan korisnik sa ID-jem {id}.");}
                else
                    return BadRequest("Neuspesno brisanje korisnika.");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}