using System;
using System.Collections.Generic;

namespace backend.tripko;

public partial class Tag
{
    public int Id { get; set; }

    public string KategorijaZnamenitosti { get; set; } = null!;
    // Lista znamenitosti koje padaju pod isti Tag
    [JsonIgnore]
    public virtual ICollection<Znamenitost> Znamenitosti { get; set; } = new List<Znamenitost>();
}
