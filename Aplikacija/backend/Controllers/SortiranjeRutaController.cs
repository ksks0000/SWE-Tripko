namespace backend.Controllers;
using backend.Servisi.Korisnik;
using backend.Servisi.RutaFunkcije;
using backend.Servisi.Email;
using backend.DTOs;
[ApiController]
[Route("[controller]")]
public class SortiranjeRutaController : ControllerBase
{
    public TripkoContext Context {get; set; }
    private KorisnikFje _korisnik;
    private readonly IEmailService _email;
    public SortiranjeRutaController(TripkoContext context) 
    {
        Context = context;
        _korisnik=new KorisnikFje();
        _email = new EmailService();
    }

    [HttpGet("SortirajSveJavnePoDatumu"),Authorize]
    public async Task<ActionResult> SortirajSveJavnePoDatumu()
    {
        try
        {
            var rute = Context.Rute
            !.Where(r => r.Dostupnost==true && r.Javna==true)
                .OrderBy(r=>r.PocetakRute);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajRezervisanePoDatumu"),Authorize]
    public async Task<ActionResult> SortirajRezervisanePoDatumu()
    {
        try
        {
            var turista = Context.Turisti!.Where(k=>k.Id == _korisnik.GetCurrentUserID(User))
            .Include(p=>p.RezervisaneRute);

            var rute = turista.Select(t=>t.RezervisaneRute.OrderBy(r=>r.PocetakRute));
            
            return Ok(await turista.Select(t=>t.RezervisaneRute.Select(r=>new {
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
                }))
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajJavneKorisnikaPoDatumu"),Authorize]
    public async Task<ActionResult> SortirajJavneKorisnikaPoDatumu()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==true && r.Dostupnost==true)
                .OrderBy(r=>r.PocetakRute);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajPrivatneKorisnikaPoDatumu"),Authorize]
    public async Task<ActionResult> SortirajPrivatneKorisnikaPoDatumu()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==false)
                .OrderBy(r=>r.PocetakRute);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajSveRuteKorisnikaPoDatumu"),Authorize]
    public async Task<ActionResult> SortirajSveRuteKorisnikaPoDatumu()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User))
                .OrderBy(r=>r.PocetakRute);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajSveJavnePoOceniRute"),Authorize] // nije implementirano
    public async Task<ActionResult> SortirajSveJavnePoOceniRute()
    {
        try
        {
            var rute = Context.Rute
            !.Where(r => r.Dostupnost==true && r.Javna==true)
            .OrderByDescending(r => r.ProsecnaOcena);

            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajRezervisanePoOceniRute"),Authorize]
    public async Task<ActionResult> SortirajRezervisanePoOceniRute()
    {
        try
        {
            var turista = Context.Turisti!.Where(k=>k.Id == _korisnik.GetCurrentUserID(User))
            .Include(p=>p.RezervisaneRute);

            var rute = turista.Select(t=>t.RezervisaneRute.OrderByDescending(r=>r.OceneRute));
            
            return Ok(await turista.Select(t=>t.RezervisaneRute.Select(r=>new {
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
                }))
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajJavneKorisnikaPoOceniRute"),Authorize]
    public async Task<ActionResult> SortirajJavneKorisnikaPoOceniRute()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==true && r.Dostupnost==true)
                .OrderBy(r=>r.ProsecnaOcena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajPrivatneKorisnikaPoOceniRute"),Authorize]
    public async Task<ActionResult> SortirajPrivatneKorisnikaPoOceniRute()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==false)
                .OrderBy(r=>r.ProsecnaOcena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajSveRuteKorisnikaPoOceniRute"),Authorize]
    public async Task<ActionResult> SortirajSveRuteKorisnikaPoOceniRute()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User))
                .OrderBy(r=>r.ProsecnaOcena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajSveJavnePoCeniRastuce"),Authorize]
    public async Task<ActionResult> SortirajSveJavnePoCeniRastuce()
    {
        try
        {
            var rute= Context.Rute!
                .Where(r=>r.Dostupnost==true && r.Javna==true)
                .OrderBy(r=>r.Cena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajRezervisanePoCeniRastuce"),Authorize]
    public async Task<ActionResult> SortirajRezervisanePoCeniRastuce()
    {
        try
        {
            var turista = Context.Turisti!.Where(k=>k.Id == _korisnik.GetCurrentUserID(User))
            .Include(p=>p.RezervisaneRute);

            var rute = turista.Select(t=>t.RezervisaneRute.OrderBy(r=>r.Cena));
            
            return Ok(await turista.Select(t=>t.RezervisaneRute.Select(r=>new {
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
                }))
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajJavneKorisnikaPoCeniRastuce"),Authorize]
    public async Task<ActionResult> SortirajJavneKorisnikaPoCeniRastuce()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==true && r.Dostupnost==true)
                .OrderBy(r=>r.Cena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajPrivatneKorisnikaPoCeniRastuce"),Authorize]
    public async Task<ActionResult> SortirajPrivatneKorisnikaPoCeniRastuce()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==false)
                .OrderBy(r=>r.Cena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajSveRuteKorisnikaPoCeniRastuce"),Authorize]
    public async Task<ActionResult> SortirajSveRuteKorisnikaPoCeniRastuce()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User))
                .OrderBy(r=>r.Cena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajSveJavnePoCeniOpadajuce"),Authorize]
    public async Task<ActionResult> SortirajSveJavnePoCeniOpadajuce()
    {
        try
        {
            var rute= Context.Rute!
                .Where(r=>r.Dostupnost==true && r.Javna==true)
                .OrderByDescending(r=>r.Cena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajRezervisanePoCeniOpadajuce"),Authorize]
    public async Task<ActionResult> SortirajRezervisanePoCeniOpadajuce()
    {
        try
        {
            var turista = Context.Turisti!.Where(k=>k.Id == _korisnik.GetCurrentUserID(User))
            .Include(p=>p.RezervisaneRute);

            var rute = turista.Select(t=>t.RezervisaneRute.OrderByDescending(r=>r.Cena));
            
            return Ok(await turista.Select(t=>t.RezervisaneRute.Select(r=>new {
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
                }))
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajJavneKorisnikaPoCeniOpadajuce"),Authorize]
    public async Task<ActionResult> SortirajJavneKorisnikaPoCeniOpadajuce()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==true && r.Dostupnost==true)
                .OrderByDescending(r=>r.Cena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajPrivatneKorisnikaPoCeniOpadajuce"),Authorize]
    public async Task<ActionResult> SortirajPrivatneKorisnikaPoCeniOpadajuce()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User) && r.Javna==false)
                .OrderByDescending(r=>r.Cena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("SortirajSveRuteKorisnikaPoCeniOpadajuce"),Authorize]
    public async Task<ActionResult> SortirajSveRuteKorisnikaPoCeniOpadajuce()
    {
        try
        {
            var rute=Context.Rute!
            .Where(r=>r.TuristaId==_korisnik.GetCurrentUserID(User))
                .OrderByDescending(r=>r.Cena);
            
            return Ok(await rute.Select(r=>new {
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
                })
            .ToListAsync());

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}