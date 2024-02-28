namespace backend.Servisi;

public class RadnoVremeFje{
    public string PretvoriUDan(int dan){
        switch(dan){
            case 1: return "ponedeljak";
            case 2: return "utorak";
            case 3: return "sreda";
            case 4: return "cetvrtak";
            case 5: return "petak";
            case 6: return "subota";
            case 7: return "nedelja";
            default: return "";
        }
    }

}