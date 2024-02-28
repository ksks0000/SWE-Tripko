namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class PowerVodicController : ControllerBase
{
    public TripkoContext Context {get; set; }

    public PowerVodicController(TripkoContext context) 
    {
        Context = context;
    }

    [HttpGet("PreuzmiPowerVodice"), Authorize]
    public async Task<ActionResult> PreuzmiPowerVodice()
    {
        return Ok(await Context.PowerVodici!.Select(v=>new
        {
            Id=v.Id,
            Ime=v.Ime,
            Prezime=v.Prezime,
            Email=v.Email,
            BrojTelefona=v.BrojTelefona,
            DatumRodjenja=v.DatumRodjenja,
            Grad=v.Grad,
            Drzava=v.Drzava,
            Pol=v.Pol
        }).ToListAsync());
    }
}