using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.tripko;

public partial class TripkoContext : DbContext
{
    public TripkoContext()
    {
    }

    public TripkoContext(DbContextOptions<TripkoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<OcenaRute>? OceneRuta { get; set; }

    public virtual DbSet<OcenaVodica>? OceneVodica { get; set; }

    public virtual DbSet<PosecujeSe>? PosecujuSe { get; set; }

    public virtual DbSet<RadnoVreme>? RadnoVreme { get; set; }

    public virtual DbSet<Ruta>? Rute { get; set; }

    public virtual DbSet<Tag>? Tagovi { get; set; }

    public virtual DbSet<Turista>? Turisti { get; set; }

    public virtual DbSet<Vodic>? Vodici { get; set; }
    
    public virtual DbSet<PowerVodic>? PowerVodici { get; set; }

    public virtual DbSet<Znamenitost>? Znamenitosti { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<OcenaRute>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("ocenio_rutu");

            entity.HasIndex(e => e.RutaId, "Ruta_ID_FK_ocenio_rutu_idx");

            entity.HasIndex(e => e.TuristaId, "Turista_ID_FK_ocenio_rutu_idx");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Bezbednost).HasColumnName("bezbednost");
            entity.Property(e => e.OdnosCenaKvalitet).HasColumnName("odnos_cena_kvalitet");
            entity.Property(e => e.Organizovanost).HasColumnName("organizovanost");
            entity.Property(e => e.Program).HasColumnName("program");
            entity.Property(e => e.RutaId).HasColumnName("ruta_ID");
            entity.Property(e => e.TuristaId).HasColumnName("turista_ID");

            entity.HasOne(d => d.Ruta).WithMany(p => p.OceneRute)
                .HasForeignKey(d => d.RutaId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Ruta_ID_FK_ocenio_rutu");

            entity.HasOne(d => d.Turista).WithMany(p => p.OcenioRute)
                .HasForeignKey(d => d.TuristaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Turista_ID_FK_ocenio_rutu");
        });

        modelBuilder.Entity<OcenaVodica>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("ocenio_vodica");

            entity.HasIndex(e => e.TuristaId, "turista_id");

            entity.HasIndex(e => e.VodicId, "vodic_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Komentar).HasMaxLength(500);
            entity.Property(e => e.Komunikacija).HasColumnName("komunikacija");
            entity.Property(e => e.Odgovornost).HasColumnName("odgovornost");
            entity.Property(e => e.Pristupacnost).HasColumnName("pristupacnost");
            entity.Property(e => e.Tacnost).HasColumnName("tacnost");
            entity.Property(e => e.TuristaId).HasColumnName("turista_id");
            entity.Property(e => e.VodicId).HasColumnName("vodic_id");
            entity.Property(e => e.Znanje).HasColumnName("znanje");

            entity.HasOne(d => d.Turista).WithMany(p => p.OceneOstavljene)
                .HasForeignKey(d => d.TuristaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("turista_id");

            entity.HasOne(d => d.Vodic).WithMany(p => p.OcenePrimljene)
                .HasForeignKey(d => d.VodicId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("vodic_id");

        });

        modelBuilder.Entity<PosecujeSe>(entity =>
        {
            entity.HasKey(e => new { e.RutaId, e.ZnamenitostId }).HasName("PRIMARY");

            entity.ToTable("posecuje_se");

            entity.HasIndex(e => e.ZnamenitostId, "Znamenitost_ID_FK_posecuje_se_idx");

            entity.Property(e => e.RutaId).HasColumnName("ruta_ID");
            entity.Property(e => e.ZnamenitostId).HasColumnName("znamenitost_ID");

            entity.HasOne(d => d.Ruta).WithMany(p => p.PosecujeSe)
                .HasForeignKey(d => d.RutaId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Ruta_ID_FK");

            entity.HasOne(d => d.Znamenitost).WithMany(p => p.PosecujuSe)
                .HasForeignKey(d => d.ZnamenitostId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Znamenitost_ID_FK_posecuje_se");
        });

        modelBuilder.Entity<RadnoVreme>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("radno_vreme");

            entity.HasIndex(e => e.ZnamenitostId, "znamenitost_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DanUNedelji).HasColumnName("dan_u_nedelji");
            entity.Property(e => e.VremeOtvaranja)
                .HasColumnType("time")
                .HasColumnName("vreme_otvaranja");
            entity.Property(e => e.VremeZatvaranja)
                .HasColumnType("time")
                .HasColumnName("vreme_zatvaranja");
            entity.Property(e => e.ZnamenitostId).HasColumnName("znamenitost_id");

            entity.HasOne(d => d.Znamenitost).WithMany(p => p.RadnoVreme)
                .HasForeignKey(d => d.ZnamenitostId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("znamenitost_id");
        });

        modelBuilder.Entity<Ruta>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("ruta");

            entity.HasIndex(e => e.TuristaId, "turista_ID_FK");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BrojTurista).HasColumnName("broj_turista");
            entity.Property(e => e.Cena)
                .HasPrecision(12, 6)
                .HasColumnName("cena");
            entity.Property(e => e.PocetakRute)
                .HasColumnType("datetime")
                .HasColumnName("datum");
            entity.Property(e => e.KrajRute)
                .HasColumnType("datetime")
                .HasColumnName("kraj_rute");
            entity.Property(e=>e.ProcenatZarade)
                .HasColumnName("procenat_zarade");
            entity.Property(e => e.Dostupnost).HasColumnName("dostupnost");
            entity.Property(e => e.Javna).HasColumnName("javna");
            entity.Property(e => e.Kapacitet).HasColumnName("kapacitet");
            entity.Property(e => e.Naziv)
                .HasMaxLength(45)
                .HasColumnName("naziv");
            entity.Property(e => e.TuristaId).HasColumnName("turista_ID");
            entity.Property(e=>e.ProsecnaOcena).HasColumnName("prosecna_ocena")
                .HasPrecision(10,2);

            entity.HasOne(d => d.Kreator).WithMany(p => p.KreiraneRute)
                .HasForeignKey(d => d.TuristaId)
                .HasConstraintName("turista_ID_FK");

            entity.HasMany(d => d.Turisti).WithMany(p => p.RezervisaneRute)
                .UsingEntity<Dictionary<string, object>>(
                    "RezervisaoRutu",
                    r => r.HasOne<Turista>().WithMany()
                        .HasForeignKey("TuristaId")
                        .HasConstraintName("turista_id_rezerv"),
                    l => l.HasOne<Ruta>().WithMany()
                        .HasForeignKey("RutaId")
                        .HasConstraintName("ruta_id_rezerv"),
                    j =>
                    {
                        j.HasKey("RutaId", "TuristaId").HasName("PRIMARY");
                        j.ToTable("rezervisao_rutu");
                        j.HasIndex(new[] { "TuristaId" }, "turista_id_rezerv");
                        j.IndexerProperty<int>("RutaId").HasColumnName("ruta_id");
                        j.IndexerProperty<int>("TuristaId").HasColumnName("turista_id");
                    });
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tag");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.KategorijaZnamenitosti)
                .HasMaxLength(45)
                .HasColumnName("kategorija_znamenitosti");

            entity.HasMany(d => d.Znamenitosti).WithMany(p => p.Tagovi)
                .UsingEntity<Dictionary<string, object>>(
                    "PripadaKategoriji",
                    r => r.HasOne<Znamenitost>().WithMany()
                        .HasForeignKey("ZnamenitostId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("znamenitost_id_kateg"),
                    l => l.HasOne<Tag>().WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("tag_id_kateg"),
                    j =>
                    {
                        j.HasKey("TagId", "ZnamenitostId").HasName("PRIMARY");
                        j.ToTable("pripada_kategoriji");
                        j.HasIndex(new[] { "ZnamenitostId" }, "znamenitost_id_kateg");
                        j.IndexerProperty<int>("TagId").HasColumnName("tag_id");
                        j.IndexerProperty<int>("ZnamenitostId").HasColumnName("znamenitost_id");
                    });
        });

        modelBuilder.Entity<Turista>(entity =>
        {

            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("turista");

            entity.HasIndex(e => e.Email, "Email_UNIQUE").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BrojTelefona)
                .HasMaxLength(45)
                .HasColumnName("broj_telefona");
            entity.Property(e => e.DatumRodjenja)
                .HasColumnType("datetime")
                .HasColumnName("datum_rodjenja");
            entity.Property(e => e.Drzava)
                .HasMaxLength(45)
                .HasColumnName("drzava");
            entity.Property(e => e.Email)
                .HasMaxLength(45)
                .HasColumnName("email");
            entity.Property(e => e.Grad)
                .HasMaxLength(60)
                .HasColumnName("grad");
            entity.Property(e => e.Ime)
                .HasMaxLength(45)
                .HasColumnName("ime");
            entity.Property(e => e.Password)
                .HasMaxLength(500)
                .HasColumnName("password");
            entity.Property(e => e.Pol)
                .HasMaxLength(1)
                .HasColumnName("pol");
            entity.Property(e => e.Prezime)
                .HasMaxLength(45)
                .HasColumnName("prezime");
            entity.Property(e => e.TipNaloga)
                .HasMaxLength(11)
                .HasColumnName("tip_naloga");
            entity.HasDiscriminator<string>("TipNaloga")
                .HasValue<Vodic>("vodic")
                .HasValue<PowerVodic>("power-vodic")
                .HasValue<Turista>("turista")
                .HasValue<Admin>("admin");

        });

        modelBuilder.Entity<Vodic>(entity => {
            entity.HasBaseType<Turista>();
            entity.Property(c=>c.ProsecnaOcena)
                  .HasColumnName("prosecna_ocena");

            
        });

        modelBuilder.Entity<PowerVodic>(entity => {
            entity.HasBaseType<Vodic>();
                  
            entity.HasMany(d => d.Znamenitosti).WithMany(p => p.PowerVodici)
                .UsingEntity<Dictionary<string, object>>(
                    "PrilozioInfo",
                    r => r.HasOne<Znamenitost>().WithMany()
                        .HasForeignKey("ZnamenitostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .HasConstraintName("Znamenitost_ID_FK"),
                    l => l.HasOne<PowerVodic>().WithMany()
                        .HasForeignKey("PowerVodicId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .HasConstraintName("Power-vodic_ID_FK"),
                    j =>
                    {
                        j.HasKey("PowerVodicId", "ZnamenitostId").HasName("PRIMARY");
                        j.ToTable("prilozio_info");
                        j.HasIndex(new[] { "ZnamenitostId" }, "Znamenitost_ID_FK_idx");
                        j.IndexerProperty<int>("PowerVodicId").HasColumnName("power-vodic_ID");
                        j.IndexerProperty<int>("ZnamenitostId").HasColumnName("znamenitost_ID");
                    });
        });

        modelBuilder.Entity<Znamenitost>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("znamenitost");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CenaUlaznice)
                .HasPrecision(10)
                .HasColumnName("cena_ulaznice");
            entity.Property(e => e.UrlSlike)
                .HasColumnName("slika_url");
            entity.Property(e => e.KoordX)
                .HasPrecision(10, 8)
                .HasColumnName("koordX");
            entity.Property(e => e.KoordY)
                .HasPrecision(10, 8)
                .HasColumnName("koordY");
            entity.Property(e => e.Naziv)
                .HasMaxLength(80)
                .HasColumnName("naziv");
            entity.Property(e => e.Opis)
                .HasMaxLength(500)
                .HasColumnName("opis");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
