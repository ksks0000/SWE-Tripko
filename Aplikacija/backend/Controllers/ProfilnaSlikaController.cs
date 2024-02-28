namespace backend.Controllers;
using backend.tripko;
using backend.Servisi.Korisnik;

[ApiController]
[Route("[controller]")]
public class ProfilnaSlikaController : ControllerBase
{
    public TripkoContext Context {get; set; }
    private KorisnikFje _korisnik {get;set;}
    public ProfilnaSlikaController(TripkoContext context) 
    {
        Context = context;
        _korisnik = new KorisnikFje();
    }

    [HttpPost("DodajProfilnuSliku"), Authorize]
    public async Task<IActionResult> DodajProfilnuSliku(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            // Handle invalid or empty file
            return BadRequest();
        }
        string ekstenzija = Path.GetExtension(file.FileName);
        //slika mora da bude manja od 2MB == 2097152B
        if(file.Length >= 2097152){
            return BadRequest("Fotografija mora biti manja od 2MB!");
        }
        // za slucaj da neko pokusa da ubaci nesto sto nije slika 
        if((ekstenzija != ".jpg" && ekstenzija != ".png") || String.IsNullOrWhiteSpace(ekstenzija)){
            return BadRequest("Fotografija mora biti .jpg ili .png!");
        }
        // Ime slike je ID korisnika i ekstenzija fotografije
        string fileName = _korisnik.GetCurrentUserID(User).ToString() + ekstenzija;

        // putanja do foldera
        string putanjaFolder = Path.Combine("c:\\Fakultet\\ProfilneSlike\\");

        // za svaki slucaj provera
        if (!Directory.Exists(putanjaFolder))
        {
            Directory.CreateDirectory(putanjaFolder);
        }

        // Spajamo putanju do foldera i ime slike
        string filePath = Path.Combine(putanjaFolder, fileName);

        // snimamo sliku u fajl sistemu na putanju filePath
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
        return Ok();
    }
    [HttpGet("PreuzmiProfilnuSliku"), Authorize]
    public ActionResult PreuzmiProfilnuSliku(){
        string picturePathJpg = Path.Combine("c:\\Fakultet\\ProfilneSlike\\", _korisnik.GetCurrentUserID(User).ToString() + ".jpg");
        string picturePathPng = Path.Combine("c:\\Fakultet\\ProfilneSlike\\", _korisnik.GetCurrentUserID(User).ToString() + ".png");
        
    // Check if the picture exists in the storage directory
    if (!System.IO.File.Exists(picturePathJpg))
    {
        if(!System.IO.File.Exists(picturePathPng)){
            return NotFound();
        }
        else{
            return PhysicalFile(picturePathPng, "image/png");
        }
    }
    // Return the picture as a file response
    return PhysicalFile(picturePathJpg, "image/jpeg");
    }
}