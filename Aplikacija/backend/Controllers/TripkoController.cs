using backend.Servisi.Email;
using backend.tripko;
using backend.DTOs;
namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class TripkoController : ControllerBase
{
    public TripkoContext Context {get; set; }
    private readonly IEmailService _email;

    public TripkoController(TripkoContext context) 
    {
        Context = context;
        _email = new EmailService();
    }

    [HttpGet("PreuzmiKorisnike"), Authorize(Roles ="admin")]
    public async Task<ActionResult> PreuzmiKorisnike()
    {
        var turiste=Context.Turisti;
        //var f=Context.Turiste.Include(p=>p.Ime);
        return Ok(await turiste!.ToListAsync());
    }

    [HttpDelete("ObrisiKorisnika/{id}"), Authorize(Roles ="admin")]
    public async Task<ActionResult> ObrisiKorisnika(int id)
    {
        try
        {
            var korisnik=await Context.Turisti!.FindAsync(id);
            if(korisnik!=null)
            {
                Context.Turisti.Remove(korisnik);
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

    [HttpGet("ProsecnaOcenaVodica/{idV}"), Authorize(Roles ="turista, vodic, power-vodic, admin")]
    public async Task<decimal> ProsecnaOcenaVodica(int idV) {
        try
        {
            var vodic=await Context.Vodici!.FindAsync(idV);
            decimal prosecnaOcena=0;
            if(vodic!=null) {
                var sveOcene=await Context.OceneVodica
                    !.Where(p=>p.VodicId==idV).ToListAsync();
                int ocTacnost=0, ocKomunikacija=0, ocZnanje=0, 
                    ocPristupacnost=0, ocOdgovornost=0;

                foreach(OcenaVodica oc in sveOcene) {
                    ocTacnost=oc.Tacnost;
                    ocKomunikacija=oc.Komunikacija;
                    ocOdgovornost=oc.Odgovornost;
                    ocZnanje=oc.Znanje;
                    ocPristupacnost=oc.Pristupacnost;

                    prosecnaOcena+=(decimal)(ocTacnost+ocKomunikacija+ocOdgovornost+ocZnanje+ocPristupacnost)/5;
                }

                prosecnaOcena /= sveOcene.Count;

                return prosecnaOcena;
            }
            else {
                return -1;
            }
        }
        catch
        {
            return -1;
        }
    }

    [HttpPut("PromovisiVodica/{id}"), Authorize(Roles ="admin")]
    public async Task<ActionResult> PromovisiVodica(int id)
    {
        try
        {
            var vodic=await Context.Vodici!.FindAsync(id);
            
            PowerVodic power=new PowerVodic();
            power.Id=vodic!.Id;
            power.Ime=vodic.Ime;
            power.Prezime=vodic.Prezime;
            power.DatumRodjenja=vodic!.DatumRodjenja;
            power.Pol=vodic.Pol;
            power.BrojTelefona=vodic!.BrojTelefona;
            power.Drzava=vodic!.Drzava;
            power.Grad=vodic.Grad;
            power.Email=vodic.Email;
            power.Password=vodic.Password;
            power.KreiraneRute=vodic.KreiraneRute;
            power.OceneOstavljene=vodic.OceneOstavljene;
            power.OcenePrimljene=vodic.OcenePrimljene;
            power.OcenioRute=vodic.OcenioRute;
            power.ProsecnaOcena=vodic.ProsecnaOcena;
            power.RezervisaneRute=vodic.RezervisaneRute;
            power.TipNaloga="power-vodic";

            Context.Vodici.Remove(vodic);
            await Context.Vodici.AddAsync(power);
            await Context.SaveChangesAsync();

            return Ok();
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // ne znam sta raditi ovde, eventualno neki flag
    [HttpPut("OdobriPromocijuVodica/{id}"), Authorize(Roles ="admin,vodic")]
    public async Task<ActionResult> OdobriPromocijuVodica(int id)
    {
        try
        {
            var vodic=await Context.Vodici!.Include(p=>p.OcenePrimljene).SingleOrDefaultAsync(p=>p.Id == id);
            if(vodic!=null)
            {
                if(vodic.ProsecnaOcena>(decimal)4.5 && vodic.OcenePrimljene.Count>=3)
                {
                    await PromovisiVodica(id);
                    EmailDTO mejl = new EmailDTO(){
                        Subject="Zahtev za promociju u power-vodica",
                        Body="Vas zahtev za promociju u power-vodica je odobren.",
                        To = vodic.Email
                    };
                    _email.SendEmail(mejl);
                    await Context.SaveChangesAsync();
                    return Ok($"Vodic {vodic.Ime} {vodic.Prezime} je promovisan.");
                }
                else
                {
                    return BadRequest("Uslovi nisu ispunjeni.");
                }
            }
            else
                return BadRequest("Neuspesna promocija vodica");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
 
}