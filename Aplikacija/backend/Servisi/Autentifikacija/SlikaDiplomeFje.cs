namespace backend.Servisi.SlikaDiplome;

public class SlikaDiplome{
    //Ovu fju pozvati kad se neko prijavi da bude vodic:
    public async Task<string> DodajSlikuDiplome(int idVodica, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            // Vraca -1 u slucaju da nije prilozio sliku diplome ili da ne valja
            return "Nevalidna slika!";
        }
        if(file.Length >= 2097152){
            return "Fotografija mora biti manja od 2MB!";
        }
        string ekstenzija = Path.GetExtension(file.FileName);
        // za slucaj da neko pokusa da ubaci nesto sto nije slika 
        if((ekstenzija != ".jpg" && ekstenzija != ".png") || String.IsNullOrWhiteSpace(ekstenzija)){
            return "Fotografija mora biti .jpg ili .png!";
        }
        // Ime slike je ID korisnika i ekstenzija fotografije
        string fileName ="Diploma" + idVodica.ToString() + Path.GetExtension(file.FileName);

        // putanja do foldera
        string putanjaFolder = Path.Combine("c:\\Fakultet\\SlikeDiplome\\");

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
        return "Uspesno dodata slika diplome!";
    }
}