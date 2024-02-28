namespace backend.tripko;

public partial class PowerVodic : Vodic
{
//     public decimal ProsecnaOcena {get; set;}
    // // // Sve ocene koje je vodic primio
    // public virtual ICollection<OcenaVodica> OcenePrimljene { get; set; } = new List<OcenaVodica>();
    // //Koje je znamenitosti Power-vodic izmenio
    public virtual ICollection<Znamenitost> Znamenitosti { get; set; } = new List<Znamenitost>();

    public PowerVodic() : base() {
        ProsecnaOcena=0;
    }
}