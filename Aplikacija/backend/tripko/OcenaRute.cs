using System;
using System.Collections.Generic;

namespace backend.tripko;

public partial class OcenaRute
{
    public int Id { get; set; }

    public int RutaId { get; set; }

    public int TuristaId { get; set; }

    public int Organizovanost { get; set; }

    public int Bezbednost { get; set; }

    public int OdnosCenaKvalitet { get; set; }

    public int Program { get; set; }

    public virtual Ruta Ruta { get; set; } = null!;

    public virtual Turista Turista { get; set; } = null!;
}
