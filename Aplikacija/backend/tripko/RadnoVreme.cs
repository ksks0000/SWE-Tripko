using System;
using System.Collections.Generic;

namespace backend.tripko;

public partial class RadnoVreme
{
    public int Id { get; set; }

    public int DanUNedelji { get; set; }

    public TimeSpan VremeOtvaranja { get; set; }

    public TimeSpan VremeZatvaranja { get; set; }

    public int ZnamenitostId { get; set; }
    //Znamenitost na koju se radno vreme odnosi
    [JsonIgnore]
    public virtual Znamenitost Znamenitost { get; set; } = null!;
}
