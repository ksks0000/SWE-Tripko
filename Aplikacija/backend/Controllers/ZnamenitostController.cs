namespace backend.tripko;

[ApiController]
[Route("[controller]")]
public class ZnamenitostController : ControllerBase
{
    public TripkoContext Context {get; set; }

    public ZnamenitostController(TripkoContext context) 
    {
        Context = context;
    }

    [HttpPost("DodajZnamenitost/{naziv}/{opis}/{cena}/{coorX}/{coorY}"), Authorize(Roles ="power-vodic, admin")]
    public async Task<ActionResult> DodajZnamenitost(string naziv, string opis, decimal cena, decimal coorX, decimal coorY,string slikaUrl)
    {
        try
        {
            Znamenitost znamenitost=new Znamenitost();
            
            znamenitost.Naziv=naziv;
            znamenitost.Opis=opis;
            znamenitost.CenaUlaznice=cena;
            znamenitost.KoordX=coorX;
            znamenitost.KoordY=coorY;
            znamenitost.UrlSlike=slikaUrl;

            Context.Znamenitosti!.Add(znamenitost);
            await Context.SaveChangesAsync();
            return Ok($"Dodata je znamenitost sa id-jem {znamenitost.Id}");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("PreuzmiZnamenitosti"), Authorize]
    public async Task<ActionResult> PreuzmiZnamenitosti()
    {
        var znamenitosti=Context.Znamenitosti;
        return Ok(await znamenitosti!.Select(
            p=> new {
                id=p.Id,
                naziv=p.Naziv,
                opis=p.Opis,
                xCoord=p.KoordX,
                yCoord=p.KoordY,
                urlSlike=p.UrlSlike,
                cena = p.CenaUlaznice
            }
        ).ToListAsync());
    }

    [HttpGet("PreuzmiZnamenitost/{idZ}"), Authorize]
    public async Task<ActionResult> PreuzmiZnamenitost(int idZ)
    {
        var znamenitosti=Context.Znamenitosti!.Where(z=>z.Id==idZ);
        return Ok(await znamenitosti!.Select(
            p=> new {
                id=p.Id,
                naziv=p.Naziv,
                opis=p.Opis,
                xCoord=p.KoordX,
                yCoord=p.KoordY,
                urlSlike=p.UrlSlike,
                cena = p.CenaUlaznice
            }
        ).ToListAsync());
    }

    [HttpDelete("ObrisiZnamenitost/{id}"), Authorize(Roles ="admin")]
    public async Task<ActionResult> ObrisiZnamenitost(int id)
    {
        try
        {
            var znamen=await Context.Znamenitosti!.FindAsync(id);
            if(znamen!=null)
            {
                Context.Znamenitosti.Remove(znamen);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno izbrisana znamenitost sa ID-jem {id}.");}
                else
                    return BadRequest("Neuspesno brisanje znamenitosti.");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniZnamenitost/{id}/{naziv}/{opis}/{cena}/{x}/{y}"), Authorize(Roles ="power-vodic, admin")]
    public async Task<ActionResult> IzmeniZnamenitost(int id, string naziv, string opis, decimal cena, decimal x, decimal y,string slikaUrl)
    {
        try
        {
            var znam=await Context.Znamenitosti!.FindAsync(id);
            if(znam!=null)
            {
                znam.Naziv=naziv;
                znam.Opis=opis;
                znam.CenaUlaznice=cena;
                znam.KoordX=x;
                znam.KoordY=y;
                znam.UrlSlike=slikaUrl;

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

    [HttpPut("PripadaKategoriji/{idZ}/{idK}"), Authorize(Roles ="power-vodic, admin")]
    public async Task<ActionResult> PripadaKategoriji(int idZ, int idK)
    {
        try
        {
            var znam=await Context.Znamenitosti!.FindAsync(idZ);
            var tag=await Context.Tagovi!.FindAsync(idK);
            if(znam!=null && tag!=null)
            {
                znam.Tagovi.Add(tag);
                
                await Context.SaveChangesAsync();
                return Ok("Tag je uspesno dodat.");
            }
            else{
                return BadRequest("Neuspesno!");
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }

}