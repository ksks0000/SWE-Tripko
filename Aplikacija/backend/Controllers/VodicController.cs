namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class VodicController : ControllerBase
{
    public TripkoContext Context {get; set; }

    public VodicController(TripkoContext context) 
    {
        Context = context;
    }

    [HttpGet("PreuzmiVodice"), Authorize]
    public async Task<ActionResult> PreuzmiVodice()
    {
        var turiste=Context.Vodici;
        return Ok(await turiste!.Select(v=>new
        {
            Ime=v.Ime,
            Prezime=v.Prezime,
            Email=v.Email,
            BrojTelefona=v.BrojTelefona,
            DatumRodjenja=v.DatumRodjenja,
            Grad=v.Grad,
            Drzava=v.Drzava,
            Pol=v.Pol,
            ProsecnaOcena=v.ProsecnaOcena
        }).ToListAsync());
    }

    [HttpGet("PreuzmiVodica/{idV}"), Authorize]
    public async Task<ActionResult> PreuzmiVodice(int idV)
    {
        var turiste=Context.Vodici!.Where(v=>v.Id==idV && (v.TipNaloga=="vodic" || v.TipNaloga=="power-vodic"));
        return Ok(await turiste!.Select(v=>new
        {
            Id=v.Id,
            Ime=v.Ime,
            Prezime=v.Prezime,
            Email=v.Email,
            BrojTelefona=v.BrojTelefona,
            DatumRodjenja=v.DatumRodjenja,
            Grad=v.Grad,
            Drzava=v.Drzava,
            Pol=v.Pol,
            ProsecnaOcena=v.ProsecnaOcena
        }).ToListAsync());
    }

    // [HttpGet("ProsecnaOcenaVodica/{idV}"), Authorize]
    // public async Task<decimal> ProsecnaOcenaVodica(int idV) {
    //     try
    //     {
    //         var vodic=await Context.Vodici!.FindAsync(idV);
    //         decimal prosecnaOcena=0;
    //         if(vodic!=null) {
    //             var sveOcene=await Context.OceneVodica
    //                 !.Where(p=>p.VodicId==idV).ToListAsync();
    //             int ocTacnost=0, ocKomunikacija=0, ocZnanje=0, 
    //                 ocPristupacnost=0, ocOdgovornost=0;

    //             foreach(OcenaVodica oc in sveOcene) {
    //                 ocTacnost=oc.Tacnost;
    //                 ocKomunikacija=oc.Komunikacija;
    //                 ocOdgovornost=oc.Odgovornost;
    //                 ocZnanje=oc.Znanje;
    //                 ocPristupacnost=oc.Pristupacnost;

    //                 prosecnaOcena+=(decimal)(ocTacnost+ocKomunikacija+ocOdgovornost+ocZnanje+ocPristupacnost)/5;
    //             }

    //             prosecnaOcena /= sveOcene.Count;

    //             vodic.ProsecnaOcena=prosecnaOcena;
    //             await Context.SaveChangesAsync();

    //             return prosecnaOcena;
    //         }
    //         else {
    //             return -1;
    //         }
    //     }
    //     catch
    //     {
    //         return -1;
    //     }
    // }
}