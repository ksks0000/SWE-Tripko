namespace backend.Controllers;
using backend.tripko;
using backend.Servisi;

[ApiController]
[Route("[controller]")]
public class RadnoVremeController : ControllerBase
{
    public TripkoContext Context {get; set; }
    private readonly RadnoVremeFje _pom;
    public RadnoVremeController(TripkoContext context) 
    {
        Context = context;
        _pom = new RadnoVremeFje();
    }

    [HttpPost("KreirajRadnoVreme/{dan}/{open}/{closed}/{idZ}"), Authorize(Roles ="power-vodic, admin")]
    public async Task<ActionResult> KreirajRadnoVreme(int dan, string open, string closed, int idZ)
    {   
        int openHour = Int32.Parse(open.Split(':')[0]);
        int openMinute = Int32.Parse(open.Split(':')[1]);
        int closedHour = Int32.Parse(closed.Split(':')[0]);                    // SREDI PARSOVANJE DA SE OSIGURAJU GRANICNI SLUCAJEVI
        int closedMinute = Int32.Parse(closed.Split(':')[1]);
        TimeSpan op = new TimeSpan(openHour, openMinute, 0);
        TimeSpan cl = new TimeSpan(closedHour, closedMinute, 0);
        try
        {
            RadnoVreme rv=new RadnoVreme();

            var znamenitost=await Context.Znamenitosti!.FindAsync(idZ);
            if(znamenitost!=null) {
                rv.DanUNedelji=dan;
                rv.VremeOtvaranja=op;
                rv.VremeZatvaranja=cl;
                rv.Znamenitost=znamenitost;

                znamenitost.RadnoVreme.Add(rv);
                await Context.RadnoVreme!.AddAsync(rv);
                await Context.SaveChangesAsync();
                return Ok($"Dodato je radno vreme za {znamenitost.Naziv} sa id-jem {rv.Id}");
        
            }
            else
            {
                return BadRequest($"Znamenitost sa id-jem {idZ} ne postoji.");
            }
           }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniRadnoVreme/{open}/{closed}/{idRadnoVreme}")]
    public async Task<ActionResult> IzmeniRadnoVreme(string open, string closed, int idRadnoVreme){
        int openHour = Int32.Parse(open.Split(':')[0]);
        int openMinute = Int32.Parse(open.Split(':')[1]);
        int closedHour = Int32.Parse(closed.Split(':')[0]);                    // SREDI PARSOVANJE DA SE OSIGURAJU GRANICNI SLUCAJEVI
        int closedMinute = Int32.Parse(closed.Split(':')[1]);
        TimeSpan op = new TimeSpan(openHour, openMinute, 0);
        TimeSpan cl = new TimeSpan(closedHour, closedMinute, 0);
        try
        {
            var rv = await Context.RadnoVreme!.SingleOrDefaultAsync(r=>r.Id == idRadnoVreme);

            if(rv!=null) {
                rv.VremeOtvaranja=op;
                rv.VremeZatvaranja=cl;

                await Context.SaveChangesAsync();
                return Ok($"Izmenjeno je radno vreme sa id-jem {rv.Id}");
        
            }
            else
            {
                return BadRequest($"Radno vreme sa id-jem {idRadnoVreme} ne postoji.");
            }
           }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("PreuzmiRadnoVremeZnamenitosti/{idZ}"), Authorize]
    public async Task<ActionResult> PreuzmiRadnoVremeZnamenitosti(int idZ){
        try{
            var radnoVremeZnamenitosti = await Context.RadnoVreme!.Where(p=>p.ZnamenitostId == idZ).ToListAsync();
            if(radnoVremeZnamenitosti != null) {
                return Ok(radnoVremeZnamenitosti.Select(p=>new{
                    dan = _pom.PretvoriUDan(p.DanUNedelji),
                    vremeOtvaranja = p.VremeOtvaranja,
                    vremeZatvaranja = p.VremeZatvaranja
                }));
            }
            else return BadRequest("Znamenitost sa zadatim ID-jem na odabranoj lokaciji ne postoji!");
        }
        catch(Exception e){
            return BadRequest(e.Message);
        }
    }

    
    [HttpGet("PreuzmiRadnaVremena"), Authorize]
    public async Task<ActionResult> PreuzmiRadnaVremena()
    {
        var lokacije=Context.RadnoVreme;
        return Ok(await lokacije!.Select(
            p=> new {
                dan = _pom.PretvoriUDan(p.DanUNedelji),
                otvor = p.VremeOtvaranja,
                zatvor = p.VremeZatvaranja,
                znam = p.ZnamenitostId
            }
        ).ToListAsync());
    }
}