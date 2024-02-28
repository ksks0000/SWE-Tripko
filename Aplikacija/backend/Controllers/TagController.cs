namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class TagController : ControllerBase
{
    public TripkoContext Context {get; set; }

    public TagController(TripkoContext context) 
    {
        Context = context;
    }

    
    [HttpPost("KreirajTag"), Authorize(Roles ="power-vodic, admin")]
    public async Task<ActionResult> KreirajTag([FromBody] Tag tag)
    {
        try
        {
            await Context.Tagovi!.AddAsync(tag);
            await Context.SaveChangesAsync();
            return Ok($"Dodaj je tag sa id-jem {tag.Id}");
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("PreuzmiTagove"), Authorize]
    public async Task<ActionResult> PreuzmiTagove()
    {
        var tagovi=Context.Tagovi;
        return Ok(await tagovi!.Select(
            p=> new {
                id=p.Id,
                kategorija=p.KategorijaZnamenitosti
            }
        ).ToListAsync());
    }

}