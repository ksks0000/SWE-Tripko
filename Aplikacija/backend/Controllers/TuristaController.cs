namespace backend.Controllers;
using backend.Servisi.Korisnik;
using backend.Servisi.Autentifikacija;

[ApiController]
[Route("[controller]")]
public class TuristaController : ControllerBase
{
    public TripkoContext Context {get; set; }
    private KorisnikFje _korisnik;
    private AutentifikacijaFje _pom { get; set; }

    public TuristaController(TripkoContext context, IConfiguration configuration) 
    {
        _pom = new AutentifikacijaFje(configuration);
        Context = context;
        _korisnik=new KorisnikFje();
    }

    [HttpPost("OceniVodica/{idV}/{tacnost}/{komunikacija}/{znanje}/{pristupacnost}/{odgovornost}/{komentar}"), Authorize(Roles ="turista,vodic, power-vodic, admin")]
    public async Task<ActionResult> OceniVodica(int idV, int tacnost, int komunikacija, int znanje, int pristupacnost, int odgovornost, string? komentar)
    {
        try
        {
            OcenaVodica ocena=new OcenaVodica();
            var turista=await Context.Turisti!.FindAsync(_korisnik.GetCurrentUserID(User));
            var vodic=await Context.Vodici!.FindAsync(idV);

            var ocenio=Context.OceneVodica!.Where(p=>p.VodicId==idV && p.TuristaId==_korisnik.GetCurrentUserID(User));
            
            if(ocenio.Count()==0)
            {

                if(vodic!.TipNaloga=="vodic")
                    ocena.Vodic=(Vodic)vodic;
                else if(vodic.TipNaloga=="power-vodic")
                    ocena.Vodic=(PowerVodic)vodic;
                ocena.Turista=turista;
                ocena.Tacnost=tacnost;
                ocena.Komunikacija=komunikacija;
                ocena.Znanje=znanje;
                ocena.Pristupacnost=pristupacnost;
                ocena.Odgovornost=odgovornost;
                ocena.Komentar=komentar;

                decimal prosek=(decimal)(tacnost+komunikacija+znanje+pristupacnost+odgovornost)/5;

                vodic.ProsecnaOcena=((vodic.ProsecnaOcena*vodic.OcenePrimljene.Count)+prosek)/(vodic.OcenePrimljene.Count+1m);

                await Context.OceneVodica!.AddAsync(ocena);
                await Context.SaveChangesAsync();
                return Ok($"Dodata je ocena vodicu {vodic.Ime} {vodic.Prezime}");
            }
            else {
                return BadRequest("Vec ste ocenili vodica!");
            }
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("OceniRutu/{idR}/{organizovanost}/{bezbednost}/{odnosCenaKvalitet}/{program}"), Authorize(Roles ="turista,vodic,power-vodic,admin")]
    public async Task<ActionResult> OceniRutu(int idR, int organizovanost, int bezbednost, int odnosCenaKvalitet, int program)
    {
        try
        {
            OcenaRute ocena=new OcenaRute();
            var turista=await Context.Turisti!.Include(t=>t.RezervisaneRute.Where(r=>r.Id==idR)).ThenInclude(r=>r.OceneRute)
                .SingleOrDefaultAsync(t=>t.Id==_korisnik.GetCurrentUserID(User));
            Ruta? ruta= turista!.RezervisaneRute.FirstOrDefault(p=>p.Id==idR);

            decimal prosek=(decimal)(organizovanost+bezbednost+odnosCenaKvalitet+program)/4;
            if(turista!=null && ruta!=null) {
                ocena.Ruta=ruta;
                ocena.Turista=turista;
                ocena.Organizovanost=organizovanost;
                ocena.Bezbednost=bezbednost;
                ocena.OdnosCenaKvalitet=odnosCenaKvalitet;
                ocena.Program=program;

                ruta.ProsecnaOcena=(ruta.ProsecnaOcena*ruta.OceneRute.Count+prosek)/(ruta.OceneRute.Count+1m);

                turista.RezervisaneRute.Remove(ruta);

                await Context.OceneRuta!.AddAsync(ocena);

                await Context.SaveChangesAsync();
                return Ok($"Dodata je ocena ruti {ruta.Naziv}");
            }
            else {
                return BadRequest("Ruta sa zadatim id-jem nije rezervisana.");
            }
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet("PreuzmiTuriste"), Authorize(Roles = "admin")]
    public async Task<ActionResult> PreuzmiTuriste()
    {
        var turiste=Context.Turisti!.Where(p=>p.TipNaloga=="turista");
        return Ok(await turiste.Select(v=>new
        {
            Ime=v.Ime,
            Prezime=v.Prezime,
            Email=v.Email,
            DatumRodjenja=v.DatumRodjenja,
            Grad=v.Grad,
            Drzava=v.Drzava,
            Pol=v.Pol
        }).ToListAsync());
    }

    [HttpGet("PreuzmiTuristu/{idT}"), Authorize]
    public async Task<ActionResult> PreuzmiTuristu(int idT)
    {
        var turista=Context.Turisti!.Where(p=>p.Id==idT);
        return Ok(await turista.Select(v=>new
        {
            Id=v.Id,
            Ime=v.Ime,
            Prezime=v.Prezime,
            Email=v.Email,
            DatumRodjenja=v.DatumRodjenja,
            Grad=v.Grad,
            Drzava=v.Drzava,
            Pol=v.Pol,
            TipNaloga=v.TipNaloga
        }).ToListAsync());
    }
    
    [HttpPut("IzmeniLicnePodatke/{ime}/{prezime}/{datumRodj}/{grad}/{drzava}/{pol}"), Authorize(Roles ="turista, vodic, power-vodic, admin")]
    public async Task<ActionResult> IzmeniLicnePodatke(string ime, string prezime, DateTime datumRodj, string grad, string drzava, string pol, string? brojTel)
    {
        try
        {
            var korisnik=await Context.Turisti!.FindAsync(_korisnik.GetCurrentUserID(User));
            if(korisnik!=null)
            {
                korisnik.Ime=ime;
                korisnik.Prezime=prezime;
                korisnik.DatumRodjenja=datumRodj;
                korisnik.Grad=grad;
                korisnik.Drzava=drzava;
                korisnik.Pol=pol;
                if(brojTel!=null)
                    korisnik.BrojTelefona=brojTel;
            
                await Context.SaveChangesAsync();
                return Ok("Podaci su uspesno promenjeni.");
            }
            else{
                return BadRequest("Neuspesna izmena podataka.");
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("IzmeniLozniku/{novaLozinka}"), Authorize(Roles ="turista, vodic, power-vodic, admin")]
    public async Task<ActionResult> IzmeniLozinku(string novaLozinka)
    {
        try
        {
            var korisnik=await Context.Turisti!.FindAsync(_korisnik.GetCurrentUserID(User));
            if(korisnik!=null)
            {
                string passwordHash = _pom.HesirajPassword(novaLozinka);
                if(passwordHash!=korisnik.Password)
                {
                    korisnik.Password = passwordHash;
                    await Context.SaveChangesAsync();
                    return Ok("Lozinka je uspesno promenjena.");
                }
                else return BadRequest("Lozinka je ista trenutnoj.");
                
            }
            else{
                return BadRequest("Neuspesna izmena lozinke.");
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}