using System;
using System.Collections.Generic;

namespace backend.tripko;

public partial class OcenaVodica
{
    public int Id { get; set; }

    public int TuristaId { get; set; }

    public int VodicId { get; set; }

    public string? Komentar { get; set; }

    public int Tacnost { get; set; }

    public int Komunikacija { get; set; }

    public int Znanje { get; set; }

    public int Pristupacnost { get; set; }

    public int Odgovornost { get; set; }

    public virtual Turista Turista { get; set; } = null!;

    public virtual Vodic Vodic { get; set; } = null!;
}
