namespace backend.tripko;

public partial class Vodic : Turista 
{
    public decimal ProsecnaOcena {get; set;}
    // Sve ocene koje je vodic primio
    [JsonIgnore]
    public virtual ICollection<OcenaVodica> OcenePrimljene { get; set; } = new List<OcenaVodica>();

    public Vodic() : base() {
        ProsecnaOcena=0;
    }
}