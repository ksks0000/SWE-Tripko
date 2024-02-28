using System.Security.Claims;

namespace backend.Servisi.Korisnik;

public class KorisnikFje{
    public int GetCurrentUserID(ClaimsPrincipal korisnik){
    var idKorisnikaObj = korisnik.Claims.Where(v=>v.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Select(p=>new string(p.Value));
        string idKorisnika = idKorisnikaObj.ElementAtOrDefault(0)!;
        if(String.IsNullOrWhiteSpace(idKorisnika)){
            return -1;
        }
        int id = 0;
        try{
            id = Int32.Parse(idKorisnika);
            return id;
        }
        catch
            {return -1;}
    }

    public bool CheckIfAdmin(ClaimsPrincipal korisnik){
        var ulogaKorisnikaObj = korisnik.Claims.Where(v=>v.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role").Select(p=>new string(p.Value));
        string ulogaKorisnika = ulogaKorisnikaObj.ElementAtOrDefault(0)!;
        if(String.IsNullOrWhiteSpace(ulogaKorisnika) || ulogaKorisnika != "admin"){
            return false;
        }
        return true;
    }
}