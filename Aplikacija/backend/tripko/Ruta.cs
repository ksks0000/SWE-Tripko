using System;
using System.Collections.Generic;

namespace backend.tripko;

public partial class Ruta
{
    public int Id { get; set; }

    public DateTime? PocetakRute { get; set; }
    
    public DateTime? KrajRute { get; set; }

    public int? Kapacitet { get; set; }

    public decimal? Cena { get; set; }

    public string Naziv { get; set; } = null!;

    public int? BrojTurista { get; set; }

    public bool? Javna { get; set; }

    public int ProcenatZarade {get; set; }

    public bool? Dostupnost { get; set; }
    
    public decimal ProsecnaOcena { get; set; }

    public int TuristaId { get; set; }
    //koje sve ocene sadrzi ruta, svoje
    [JsonIgnore]
    public virtual ICollection<OcenaRute> OceneRute { get; set; } = new List<OcenaRute>();
    // koje sve znamenitosti se posecuju u okviru rute
    [JsonIgnore]
    public virtual ICollection<PosecujeSe> PosecujeSe { get; set; } = new List<PosecujeSe>();
    // nesto sto je EF sam generisao, kreator rute?
    [JsonIgnore] 
    public virtual Turista Kreator { get; set; } = null!;
    // Lista turista koji su rezervisali rutu
    [JsonIgnore]
    public virtual ICollection<Turista> Turisti { get; set; } = new List<Turista>();

    public Ruta() {
        Kapacitet=0;
        BrojTurista=0;
        Cena=0;
        ProcenatZarade=0;
        ProsecnaOcena=0;
        Dostupnost=true;
        Javna=false;
    }
}
