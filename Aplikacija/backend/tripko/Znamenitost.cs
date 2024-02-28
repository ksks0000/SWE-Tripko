using System;
using System.Collections.Generic;

namespace backend.tripko;

public partial class Znamenitost
{
    public int Id { get; set; }

    public string Naziv { get; set; } = null!;

    public string? Opis { get; set; }

    public decimal? CenaUlaznice { get; set; }

    public string? UrlSlike {get; set; }

    public decimal? KoordX { get; set; }

    public decimal? KoordY { get; set; }
    
    // Prakticno je ovo lista Ruta koje sadrze ovu znamenitost 
    [JsonIgnore]
    public virtual ICollection<PosecujeSe> PosecujuSe { get; set; } = new List<PosecujeSe>();
    //Lista koja ce da ima 7 elemenata sa Radnim vremenom za svaki dan
    [JsonIgnore]
    public virtual ICollection<RadnoVreme> RadnoVreme { get; set; } = new List<RadnoVreme>();
    // Svi power-vodici koji su dodali info o znamenitosti
    [JsonIgnore]
    public virtual ICollection<PowerVodic> PowerVodici { get; set; } = new List<PowerVodic>();
    // Svi tagovi koje znamenitost sadrzi
    [JsonIgnore]
    public virtual ICollection<Tag> Tagovi { get; set; } = new List<Tag>();
}
