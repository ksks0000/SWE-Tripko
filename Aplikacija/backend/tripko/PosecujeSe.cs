using System;
using System.Collections.Generic;

namespace backend.tripko;

public partial class PosecujeSe
{
    public int RutaId { get; set; }

    public int ZnamenitostId { get; set; }

    public virtual Ruta Ruta { get; set; } = null!;

    public virtual Znamenitost Znamenitost { get; set; } = null!;
}
