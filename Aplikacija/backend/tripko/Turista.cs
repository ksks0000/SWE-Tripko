using System;
using System.Collections.Generic;

namespace backend.tripko;

public partial class Turista
{
    public int Id { get; set; }

    public string Ime { get; set; } = null!;

    public string Prezime { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public DateTime? DatumRodjenja { get; set; }

    public string Grad { get; set; } = null!;

    public string TipNaloga { get; set; } = null!;

    public string Drzava { get; set; } = null!;

    public string? Pol { get; set; }

    public string? BrojTelefona { get; set; }

    // Koje je sve Ocene ostavio turista rutama koje je posetio
    [JsonIgnore]
    public virtual ICollection<OcenaRute> OcenioRute { get; set; } = new List<OcenaRute>();
    // Koje je sve ocene ostavio turista vodicima
    [JsonIgnore]
    public virtual ICollection<OcenaVodica> OceneOstavljene { get; set; } = new List<OcenaVodica>();

    // public virtual ICollection<OcenioVodica> OcenePrimljene { get; set; } = new List<OcenioVodica>();
    
    // Nesto sto je EF generisao, kreirane rute?
    [JsonIgnore]
    public virtual ICollection<Ruta> KreiraneRute { get; set; } = new List<Ruta>();
    // Koje je rute posetio/posecuje turista/vodic/power-vodic
    [JsonIgnore]
    public virtual ICollection<Ruta> RezervisaneRute { get; set; } = new List<Ruta>();

}
