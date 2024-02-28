namespace backend.Servisi.RutaFunkcije;

public class RutaFunkcije {
    public static void ResetujPodatkeRute(Ruta ruta) {
        ruta.Javna=false;
        ruta.Dostupnost=true;
        ruta.Kapacitet=0;
        ruta.BrojTurista=0;
        ruta.Cena=0;
        ruta.ProcenatZarade=0;

        foreach (PosecujeSe poseta in ruta.PosecujeSe)
        {
            ruta.Cena+=poseta.Znamenitost.CenaUlaznice; 
        }
    }

    public static void ProveriDostupnostRuta(IQueryable<Ruta> rute)
    {
        foreach(Ruta ruta in rute) {
            if(ruta.Kapacitet==ruta.BrojTurista || ruta.PocetakRute<=DateTime.Now)
            {
                ruta.Dostupnost=false;

                if(ruta.KrajRute<=DateTime.Now) {
                    RutaFunkcije.ResetujPodatkeRute(ruta);
                }

                //rute.Remove(ruta);
            }
        }
    }
}