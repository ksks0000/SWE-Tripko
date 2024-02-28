namespace backend.Controllers;
using backend.Servisi.Korisnik;
using backend.Servisi.RutaFunkcije;
using backend.Servisi.Email;
using backend.DTOs;
[ApiController]
[Route("[controller]")]
public class RutaController : ControllerBase
{
    public TripkoContext Context {get; set; }
    private KorisnikFje _korisnik;
    private readonly IEmailService _email;
    public RutaController(TripkoContext context) 
    {
        Context = context;
        _korisnik=new KorisnikFje();
        _email = new EmailService();
    }
    
    [HttpPost("KreirajRutu/{pocetak}/{kraj}/{naziv}"), Authorize(Roles ="turista, vodic, power-vodic, admin")]
    public async Task<ActionResult> KreirajRutu(DateTime pocetak, DateTime kraj, string naziv)
    {
        try
        {
            if(kraj<pocetak || pocetak<DateTime.Now)
                return BadRequest("Nevalidan datum zavrsetka rute.");

            Ruta ruta=new Ruta();
            var turista=await Context.Turisti!.FindAsync(_korisnik.GetCurrentUserID(User));

            if(turista!=null) {
                ruta.Kreator=turista;
                ruta.Naziv=naziv;
                ruta.PocetakRute=pocetak;
                ruta.KrajRute=kraj;

                await Context.Rute!.AddAsync(ruta);
                await Context.SaveChangesAsync();
                return Ok($"Dodata je ruta sa id-jem {ruta.Id}");
            }
            else {
                return BadRequest("NEUSPESNO");
            }
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("OglasiRutu/{idR}/{kapacitet}/{procenatZarade}/{pocetak}/{kraj}"), Authorize(Roles ="vodic, power-vodic, admin")]
    public async Task<ActionResult> OglasiRutu(int idR, int kapacitet, int procenatZarade, DateTime pocetak, DateTime kraj)
    {
        try
        {
            var ruta=await Context.Rute!.Include(r=>r.Turisti)
                .SingleOrDefaultAsync(r=>r.Id==idR);
            if(ruta!.TuristaId==_korisnik.GetCurrentUserID(User) && ruta.Javna==false) {

                ruta.Javna=true;
                ruta.Cena+=ruta.Cena*(procenatZarade+1)*(decimal)0.01;
                ruta.Kapacitet=kapacitet;
                ruta.ProcenatZarade=procenatZarade;
                ruta.PocetakRute=pocetak;
                ruta.KrajRute=kraj;
                
                // brisu se bivsi putnici na ruti, zarad ponovnog objavljivanja iste rute
                foreach(Turista turista in ruta.Turisti)
                {
                    turista.RezervisaneRute.Remove(ruta);
                }

                await Context.SaveChangesAsync();
                return Ok($"Ruta sa id-jem {ruta.Id} je oglasena.");
            }
            else {
                return BadRequest("NEUSPESNO");
            }
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("ProglasiRutuPrivatnom/{idR}"), Authorize(Roles ="vodic, power-vodic, admin")]
    public async Task<ActionResult> ProglasiRutuPrivatnom(int idR)
    {
        try
        {
            var ruta=await Context.Rute!.Include(r=>r.Turisti).ThenInclude(t=>t.RezervisaneRute)
                .Include(r=>r.PosecujeSe).ThenInclude(p=>p.Znamenitost)
                .SingleOrDefaultAsync(r=>r.Id==idR);

            if(ruta!.TuristaId==_korisnik.GetCurrentUserID(User) && ruta.Javna==true) {

                RutaFunkcije.ResetujPodatkeRute(ruta);
                EmailDTO obavestenje = new EmailDTO(){
                    Subject = "Otkazana ruta",
                    Body = $"<p>Ruta na koju ste se pretplatili, sa nazivom <font color=\"red\"><i>{ruta.Naziv}</i></font> je otkazana.</p>"
                };
                
                if(ruta.Turisti.Count != 0){
                    foreach(Turista turista in ruta.Turisti)
                    {
                        obavestenje.To = turista.Email;
                        _email.SendEmail(obavestenje);
                        turista.RezervisaneRute.Remove(ruta);
                    }
                }

                await Context.SaveChangesAsync();
                return Ok($"Ruta sa id-jem {ruta.Id} je obustavljena.");
            }
            else {
                return BadRequest("NEUSPESNO");
            }
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("DodajPosetu/{idR}/{idZ}"), Authorize(Roles ="turista, vodic, power-vodic, admin")]
    public async Task<ActionResult> DodajPosetu(int idR, int idZ)
    {
        try
        {
            PosecujeSe poseta=new PosecujeSe();
            var ruta=await Context.Rute!.FindAsync(idR);
            var znamenitost=await Context.Znamenitosti!.FindAsync(idZ);

            if(ruta!.TuristaId==_korisnik.GetCurrentUserID(User) && ruta!=null && znamenitost!=null) {
                poseta.Ruta=ruta;
                poseta.Znamenitost=znamenitost;
                
                if(ruta.Javna==true)
                    ruta.Cena+=znamenitost.CenaUlaznice+znamenitost.CenaUlaznice*(ruta.ProcenatZarade+1)*(decimal)0.01;
                else
                    ruta.Cena+=znamenitost.CenaUlaznice;
                    
                await Context.PosecujuSe!.AddAsync(poseta);
                await Context.SaveChangesAsync();
                return Ok($"Dodata je poseta {znamenitost.Naziv} ruti {ruta.Naziv}");
            }
            else {
                return BadRequest("NEUSPESNO");
            }
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("ProsecnaOcenaRute/{idR}"), Authorize]
    public async Task<decimal> ProsecnaOcenaRute(int idR) {
        try
        {
            var ruta=await Context.Rute!.FindAsync(idR);
            decimal prosecnaOcena=0;
            if(ruta!=null) {
                var sveOcene=await Context.OceneRuta
                    !.Where(p=>p.RutaId==idR).ToListAsync();
                int ocOrganizovanost=0, ocBezbednost=0, ocOdnosCK=0, 
                    ocProgram=0;

                foreach(OcenaRute oc in sveOcene) {
                    ocOrganizovanost=oc.Organizovanost;
                    ocBezbednost=oc.Bezbednost;
                    ocOdnosCK=oc.OdnosCenaKvalitet;
                    ocProgram=oc.Program;

                    prosecnaOcena+=(decimal)(ocOrganizovanost + ocBezbednost + ocOdnosCK + ocProgram)/4;
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
            // obraditi ex
            return -1;
        }
    }

    [HttpDelete("ObrisiRutu/{id}"), Authorize(Roles ="turista, vodic, power-vodic, admin")]
    public async Task<ActionResult> ObrisiRutu(int id)
    {
        try
        {
            var ruta=await Context.Rute!.Where(p=>p.Id == id).Include(c=>c.Turisti).FirstOrDefaultAsync();
            if((ruta!.TuristaId==_korisnik.GetCurrentUserID(User) && ruta!=null) || _korisnik.CheckIfAdmin(User))
            {           
                if(ruta.Turisti.Count != 0){
                    EmailDTO obavestenje = new EmailDTO(){
                    Subject = "Otkazana ruta",
                    Body = $"<p>Ruta na koju ste se pretplatili, sa nazivom <font color=\"red\"><i>{ruta.Naziv}</i></font> je nedostupna.</p>"
                    };
                    foreach(Turista turista in ruta.Turisti)
                    {
                        obavestenje.To = turista.Email;
                        _email.SendEmail(obavestenje);
                        turista.RezervisaneRute.Remove(ruta);
                    }
                }
                Context.Rute!.Remove(ruta);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno izbrisana ruta sa ID-jem {id}.");}
                else
                    return BadRequest("Neuspesno brisanje rute.");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniRutu/{id}/{naziv}/{datum}/{kraj}/{kapac}/{cena}"), Authorize(Roles ="turista, vodic, power-vodic, admin")]
    public async Task<ActionResult> IzmeniRutu(int id, string naziv, DateTime datum, DateTime kraj, int kapac, decimal cena, int brTur)
    {
        try
        {
            var ruta=await Context.Rute!.FindAsync(id);
            if((ruta!.TuristaId==_korisnik.GetCurrentUserID(User)))
            {
                ruta.Naziv=naziv;
                ruta.PocetakRute=datum;
                ruta.KrajRute=kraj;
                ruta.Kapacitet=kapac;
                ruta.Cena=cena;
                // ruta.ProcenatZarade=zarada;

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

    [HttpPut("RezervisiRutu/{idR}"),Authorize(Roles = "turista,vodic,power-vodic,admin")]
    public async Task<ActionResult> RezervisiRutu(int idR)
    {
        try
        {
            var turista=await Context.Turisti!.FindAsync(_korisnik.GetCurrentUserID(User));
            var ruta= await Context.Rute!.Where(p=>p.Id == idR).Include(c=>c.Kreator).FirstOrDefaultAsync();
            if(ruta!.Dostupnost==true && turista != null)
            {
                ruta.Turisti.Add(turista);
                ruta.BrojTurista++;
                if(ruta.BrojTurista>=ruta.Kapacitet)
                    ruta.Dostupnost=false;
                EmailDTO mejl = new EmailDTO(){
                    Subject = "Nova prijava za Vasu rutu",
                    Body = $"<p>Na Vasu rutu <font color=\"green\"><i>{ruta.Naziv}</i></font> se prijavio turista {turista.Ime} {turista.Prezime}.</p>",
                    To = ruta.Kreator.Email
                };
                _email.SendEmail(mejl);
                await Context.SaveChangesAsync();
                return Ok("Uspesno rezervisanje rute.");
            }
            else return BadRequest("NEUSPESNO!");

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("OtkaziRezervacijuRute/{idR}"),Authorize(Roles = "turista,vodic,power-vodic,admin")]
    public async Task<ActionResult> OtkaziRezervacijuRute(int idR)
    {
        try
        {
            var turista=await Context.Turisti!.Include(t=>t.RezervisaneRute)
                .FirstOrDefaultAsync(t => t.Id == _korisnik.GetCurrentUserID(User));
            var ruta=await Context.Rute!.Where(p=>p.Id == idR).Include(c=>c.Kreator).FirstOrDefaultAsync();

            if(ruta!= null && ruta.Javna==true && turista!.RezervisaneRute.Contains(ruta))
            {
                turista!.RezervisaneRute.Remove(ruta);
                ruta.Turisti.Remove(turista);
                if(ruta.BrojTurista==ruta.Kapacitet)
                    ruta.Dostupnost=true;
                ruta!.BrojTurista--;
                EmailDTO mejl = new EmailDTO(){
                    Subject = "Otkazana prijava za Vasu rutu",
                    Body = $"<p>Sa Vase rute <font color=\"blue\"><i>{ruta.Naziv}</i></font> se odjavio turista {turista.Ime} {turista.Prezime}.</p>",
                    To = ruta.Kreator.Email
                };
                _email.SendEmail(mejl);
                await Context.SaveChangesAsync();
                return Ok("Uspesno otkazivanje rute.");
            }
            else return BadRequest("Ruta nije rezervisana!");
            
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("PreuzmiRutu/{idR}"),Authorize]
    public async Task<ActionResult> PreuzmiRutu(int idR)
    {
        try
        {
            var ruta=await Context.Rute!.Where(r=>r.Id==idR).Include(r=>r.PosecujeSe).Select(ruta=>new{
                Id=ruta.Id,
                    NazivRute=ruta.Naziv,
                    Pocetak=ruta.PocetakRute,
                    Kraj=ruta.KrajRute,
                    Cena=ruta.Cena,
                    BrojSlobodnihMesta=ruta.Kapacitet - ruta.BrojTurista,
                    ProsecnaOcenaRute=ruta.ProsecnaOcena,
                    IdVodica=ruta.Kreator.Id,
                    ImeVodica=ruta.Kreator.Ime,
                    PrezimeVodica=ruta.Kreator.Prezime,
                    Znamenitosti=ruta.PosecujeSe.Select(p=>p.ZnamenitostId).ToList(),
                    Tagovi=ruta.PosecujeSe.Select(s=>s.Znamenitost.Tagovi.Select(s=>s.KategorijaZnamenitosti))}).ToListAsync();
            if(ruta!=null){
                return Ok(ruta);
            }
            else return BadRequest("NEUSPESNO!");
            

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("PreuzmiTuristeNaRuti/{idR}"),Authorize]
    public async Task<ActionResult> PreuzmiTuristeNaRuti(int idR)
    {
        try
        {
            var ruta=await Context.Rute!
                .Where(r=>r.Id==idR && r.TuristaId==_korisnik.GetCurrentUserID(User))
                .Include(r=>r.Turisti)
                .Select(r=>r.Turisti.Select(t=>new {
                    Id=t.Id,
                    Ime=t.Ime,
                    Prezime=t.Prezime,
                    Email=t.Email
                })).ToListAsync();
            
            if(ruta!=null){
                return Ok(ruta);
            }
            else return BadRequest("Vasa ruta je trenutno prazna.");
            

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("PreuzmiSveJavneRute"),Authorize]
    public async Task<ActionResult> PreuzmiSveJavneRute()
    {
        try
        {
            var turista= await Context.Turisti!.Include(t=>t.RezervisaneRute)
                .SingleOrDefaultAsync(t=>t.Id==_korisnik.GetCurrentUserID(User));
            var sveRute= Context.Rute!.Include(r=>r.PosecujeSe).ThenInclude(p=>p.Znamenitost)
                .Where(r=>r.Javna==true && r.Dostupnost==true
                    &&!turista!.RezervisaneRute.Contains(r));

            foreach(Ruta ruta in sveRute) {
                if(ruta.Kapacitet==ruta.BrojTurista || ruta.PocetakRute<=DateTime.Now)
                {
                    ruta.Dostupnost=false;

                    if(ruta.KrajRute<=DateTime.Now) {
                        //RutaFunkcije.ResetujPodatkeRute(ruta);
                        ruta.Javna=false;
                        ruta.Dostupnost=true;
                        ruta.Kapacitet=0;
                        ruta.BrojTurista=0;
                        ruta.Cena=0;
                        ruta.ProcenatZarade=0;

                        foreach (PosecujeSe poseta in ruta.PosecujeSe)
                        {
                            ruta.Cena+=poseta.Znamenitost.CenaUlaznice; 
                        }
                    }
                }
            }
            await Context.SaveChangesAsync();

            return Ok(await sveRute
                .Select(r=>new {
                    Id=r.Id,
                    NazivRute=r.Naziv,
                    Pocetak=r.PocetakRute,
                    Kraj=r.KrajRute,
                    Cena=r.Cena,
                    BrojSlobodnihMesta=r.Kapacitet - r.BrojTurista,
                    ProsecnaOcenaRute=r.ProsecnaOcena,
                    IdVodica=r.Kreator.Id,
                    ImeVodica=r.Kreator.Ime,
                    PrezimeVodica=r.Kreator.Prezime,
                    Tagovi=r.PosecujeSe.Select(s=>s.Znamenitost.Tagovi.Select(s=>s.KategorijaZnamenitosti))
                }).ToListAsync());
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("PreuzmiRezervisaneRuteKorisnika"),Authorize]
    public async Task<ActionResult> PreuzmiRezervisaneRuteKorisnika()
    {
        try
        {
            var turista = Context.Turisti!.Where(k=>k.Id == _korisnik.GetCurrentUserID(User))
            .Include(p=>p.RezervisaneRute);

            return Ok(await turista.Select(p=>p.RezervisaneRute.Select(r=>new {
                    Id=r.Id,
                    NazivRute=r.Naziv,
                    Pocetak=r.PocetakRute,
                    Kraj=r.KrajRute,
                    Cena=r.Cena,
                    BrojSlobodnihMesta=r.Kapacitet - r.BrojTurista,
                    ProsecnaOcenaRute=r.ProsecnaOcena,
                    IdVodica=r.Kreator.Id,
                    ImeVodica=r.Kreator.Ime,
                    PrezimeVodica=r.Kreator.Prezime,
                    Tagovi=r.PosecujeSe.Select(s=>s.Znamenitost.Tagovi.Select(s=>s.KategorijaZnamenitosti))
                })).ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("PreuzmiOcenjeneRuteKorisnika"),Authorize]
    public async Task<ActionResult> PreuzmiOcenjeneRuteKorisnika()
    {
        try
        {
            var ocene = await Context.OceneRuta!.Where(o=>o.TuristaId == _korisnik.GetCurrentUserID(User))
            .Include(p=>p.Ruta).Select(o=>new{
                Id=o.Ruta.Id,
                NazivRute=o.Ruta.Naziv,
                Pocetak=o.Ruta.PocetakRute,
                Kraj=o.Ruta.KrajRute,
                Cena=o.Ruta.Cena,
                BrojSlobodnihMesta=o.Ruta.Kapacitet - o.Ruta.BrojTurista,
                ProsecnaOcenaRute=o.Ruta.ProsecnaOcena,
                IdVodica=o.Ruta.Kreator.Id,
                ImeVodica=o.Ruta.Kreator.Ime,
                PrezimeVodica=o.Ruta.Kreator.Prezime,
                Tagovi=o.Ruta.PosecujeSe.Select(s=>s.Znamenitost.Tagovi.Select(s=>s.KategorijaZnamenitosti))
            }).ToListAsync();

            return Ok(ocene);

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("PreuzmiJavneRuteKorisnika"),Authorize]
    public async Task<ActionResult> PreuzmiJavneRuteKorisnika()
    {
        try
        {
            var rute=await Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==true && r.Dostupnost==true)
            .Select(r=>new {
                    Id=r.Id,
                    NazivRute=r.Naziv,
                    Pocetak=r.PocetakRute,
                    Kraj=r.KrajRute,
                    Cena=r.Cena,
                    BrojSlobodnihMesta=r.Kapacitet - r.BrojTurista,
                    ProsecnaOcenaRute=r.ProsecnaOcena,
                    IdVodica=r.Kreator.Id,
                    ImeVodica=r.Kreator.Ime,
                    PrezimeVodica=r.Kreator.Prezime,
                    Tagovi=r.PosecujeSe.Select(s=>s.Znamenitost.Tagovi.Select(s=>s.KategorijaZnamenitosti))
                }).ToListAsync();

            return Ok(rute);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("PreuzmiPrivatneRuteKorisnika"),Authorize]
    public async Task<ActionResult> PreuzmiPrivatneRuteKorisnika()
    {
        try
        {
            var rute=await Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==false)
            .Select(r=>new {
                    Id=r.Id,
                    NazivRute=r.Naziv,
                    Pocetak=r.PocetakRute,
                    Kraj=r.KrajRute,
                    Cena=r.Cena,
                    BrojSlobodnihMesta=r.Kapacitet - r.BrojTurista,
                    ProsecnaOcenaRute=r.ProsecnaOcena,
                    IdVodica=r.Kreator.Id,
                    ImeVodica=r.Kreator.Ime,
                    PrezimeVodica=r.Kreator.Prezime,
                    Tagovi=r.PosecujeSe.Select(s=>s.Znamenitost.Tagovi.Select(s=>s.KategorijaZnamenitosti))
                }).ToListAsync();

            return Ok(rute);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("PreuzmiSveRuteKorisnika"),Authorize]
    public async Task<ActionResult> PreuzmiSveRuteKorisnika()
    {
        try
        {
            var rute=await Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User))
            .Select(r=>new {
                    Id=r.Id,
                    NazivRute=r.Naziv,
                    Pocetak=r.PocetakRute,
                    Kraj=r.KrajRute,
                    Cena=r.Cena,
                    BrojSlobodnihMesta=r.Kapacitet - r.BrojTurista,
                    ProsecnaOcenaRute=r.ProsecnaOcena,
                    IdVodica=r.Kreator.Id,
                    ImeVodica=r.Kreator.Ime,
                    PrezimeVodica=r.Kreator.Prezime,
                    Tagovi=r.PosecujeSe.Select(s=>s.Znamenitost.Tagovi.Select(s=>s.KategorijaZnamenitosti))
                }).ToListAsync();

            return Ok(rute);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }



    [HttpGet("PretraziPoZnamenitosti/{idZ}"),Authorize]
    public async Task<ActionResult> PretraziPoZnamenitosti(int idZ)
    {
        try
        {
            var rute=await Context.Rute
            !.Where(r=>r.Dostupnost==true && r.Javna==true
            && r.PosecujeSe.Any(p=>p.ZnamenitostId==idZ))
            .ToListAsync();

            return Ok(rute.Select(r=>new {
                    Id=r.Id,
                    NazivRute=r.Naziv,
                    Pocetak=r.PocetakRute,
                    Kraj=r.KrajRute,
                    Cena=r.Cena,
                    BrojSlobodnihMesta=r.Kapacitet - r.BrojTurista,
                    ProsecnaOcenaRute=r.ProsecnaOcena,
                    IdVodica=r.Kreator.Id,
                    ImeVodica=r.Kreator.Ime,
                    PrezimeVodica=r.Kreator.Prezime
                })
            .ToList());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("PretraziPoKategoriji/{idK}"),Authorize]
    public async Task<ActionResult> PretraziPoKategoriji(int idK)
    {
        try
        {
            var rute=await Context.Rute
            !.Where(r=>r.Dostupnost==true && r.Javna==true
            && r.PosecujeSe.Any(p=>p.Znamenitost.Tagovi.Any(t=>t.Id==idK)))
            .ToListAsync();

            return Ok(rute.Select(r=>new {
                    Id=r.Id,
                    NazivRute=r.Naziv,
                    Pocetak=r.PocetakRute,
                    Kraj=r.KrajRute,
                    Cena=r.Cena,
                    BrojSlobodnihMesta=r.Kapacitet - r.BrojTurista,
                    ProsecnaOcenaRute=r.ProsecnaOcena,
                    IdVodica=r.Kreator.Id,
                    ImeVodica=r.Kreator.Ime,
                    PrezimeVodica=r.Kreator.Prezime
                })
            .ToList());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}