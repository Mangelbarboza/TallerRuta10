using Microsoft.EntityFrameworkCore;
using System;
using Taller_back.Domain;

namespace Taller_back.Infraestructure
{
    public class ApplicationDBContext: DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
        : base(options)
        {
        }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<BranchService> BranchServices { get; set; }
        public DbSet<BranchProduct> BranchProducts { get; set; }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentService> AppointmentServices { get; set; }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Client> Clients { get; set; }

        public DbSet<Employee> Employee { get; set; }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Branch>(entity =>
            {
                entity.ToTable("Branch");
                entity.HasKey(b => b.IdBranch);

                entity.Property(b => b.Name).IsRequired().HasMaxLength(100);
                entity.Property(b => b.Address).IsRequired().HasMaxLength(200);
                entity.Property(b => b.Phone).IsRequired().HasMaxLength(20);
                entity.Property(b => b.Email).IsRequired().HasMaxLength(100);
                entity.Property(b => b.Schedule).IsRequired().HasMaxLength(100);
                entity.Property(b => b.IsActive).HasDefaultValue(true);
            });
            modelBuilder.Entity<Service>(entity =>
            {
                entity.ToTable("Service");

                entity.HasKey(s => s.IdService);

                entity.Property(s => s.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(s => s.Description)
                      .HasMaxLength(500);

                entity.Property(s => s.BasePrice)
                      .HasColumnType("decimal(10,2)")
                      .IsRequired();

                entity.Property(s => s.IsActive)
                      .HasDefaultValue(true);

                entity.HasOne(s => s.Offer)
                      .WithMany()
                      .HasForeignKey(s => s.IdOffer)
                      .IsRequired(false);
            });
            modelBuilder.Entity<Offer>(entity =>
            {
                entity.ToTable("Offer");

                entity.HasKey(o => o.IdOffer);

                entity.Property(o => o.StartDate)
                      .IsRequired();

                entity.Property(o => o.EndDate)
                      .IsRequired();

                entity.Property(o => o.Discount)
                      .HasColumnType("decimal(10,2)")
                      .IsRequired();

                entity.Property(o => o.IsActive)
                      .HasDefaultValue(true);
            });
            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.ToTable("Supplier");
                entity.HasKey(s => s.IdSupplier);

                entity.Property(s => s.Name).IsRequired().HasMaxLength(100);
                entity.Property(s => s.Email).IsRequired().HasMaxLength(200);
                entity.Property(s => s.Phone).IsRequired().HasMaxLength(20);
                entity.Property(s => s.Email).IsRequired().HasMaxLength(100);
                entity.Property(s => s.Manager).IsRequired().HasMaxLength(100);
                entity.Property(s => s.IsActive).HasDefaultValue(true);
            });
            modelBuilder.Entity<BranchService>().ToTable("BranchService");
            modelBuilder.Entity<BranchService>()
                .HasKey(bs => new { bs.IdBranch, bs.IdService });

            modelBuilder.Entity<BranchService>()
                .HasOne(bs => bs.Branch)
                .WithMany(b => b.BranchServices)
                .HasForeignKey(bs => bs.IdBranch);

            modelBuilder.Entity<BranchService>()
                .HasOne(bs => bs.Service)
                .WithMany(s => s.BranchServices)
                .HasForeignKey(bs => bs.IdService);

            modelBuilder.Entity<BranchProduct>(entity =>
            {
                entity.ToTable("BranchProduct");

                entity.HasKey(bp => new { bp.IdBranch, bp.IdProduct });

                entity.Property(bp => bp.Stock)
                      .HasDefaultValue(0);

                entity.HasOne(bp => bp.Branch)
                      .WithMany(b => b.BranchProducts)
                      .HasForeignKey(bp => bp.IdBranch);

                entity.HasOne(bp => bp.Product)
                      .WithMany(p => p.BranchProducts)
                      .HasForeignKey(bp => bp.IdProduct);
            });

            modelBuilder.Entity<Client>(entity =>
            {
                entity.ToTable("Client");

                entity.HasKey(c => c.IdClient);

                entity.Property(c => c.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(c => c.LastName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(c => c.Phone)
                      .IsRequired()
                      .HasMaxLength(20);

                entity.Property(c => c.Email)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(c => c.WithAppointment)
                      .HasDefaultValue(false);

                entity.Property(c => c.IsActive)
      .HasDefaultValue(true);

                entity.HasIndex(c => c.Phone).IsUnique();
                entity.HasIndex(c => c.Email).IsUnique();
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employee");
                entity.HasKey(e => e.IdEmployee);

                entity.HasOne(e => e.Branch)
                    .WithMany()
                    .HasForeignKey(e => e.IdBranch);
            });


            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.ToTable("Appointment");
                entity.HasKey(a => a.IdAppointment);

                entity.Property(a => a.Time)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.HasOne(a => a.Branch)
                    .WithMany()
                    .HasForeignKey(a => a.IdBranch);
                entity.Property(a => a.ClientWasCreatedHere)
    .HasDefaultValue(false);

                entity.HasOne(a => a.Client)
                    .WithMany()
                    .HasForeignKey(a => a.IdClient)
                    .IsRequired(false);


                entity.HasMany(a => a.AppointmentServices)
                    .WithOne(x => x.Appointment)
                    .HasForeignKey(x => x.IdAppointment);

            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Product");

                entity.HasKey(p => p.IdProduct);

                entity.Property(p => p.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(p => p.Description)
                      .HasMaxLength(300);

                entity.Property(p => p.SalePrice)
                      .HasColumnType("decimal(10,2)")
                      .IsRequired();

                entity.HasOne(p => p.Supplier)
                      .WithMany()
                      .HasForeignKey(p => p.IdSupplier);

                entity.Property(p => p.IsActive)
                       .HasDefaultValue(true);

                entity.HasOne(p => p.Offer)
                      .WithMany()
                      .HasForeignKey(p => p.IdOffer)
                      .IsRequired(false);
            });


            modelBuilder.Entity<AppointmentService>(entity =>
            {
                entity.ToTable("AppointmentService");
                entity.HasKey(x => new { x.IdAppointment, x.IdService });

                entity.HasOne(x => x.Appointment)
                    .WithMany(a => a.AppointmentServices)
                    .HasForeignKey(x => x.IdAppointment);

                entity.HasOne(x => x.Service)
                    .WithMany(s => s.AppointmentServices)
                    .HasForeignKey(x => x.IdService);
            });

            modelBuilder.Entity<Admin>().ToTable("Admin");

            modelBuilder.Entity<Admin>().HasKey(a => a.AdminId);

        }
    }
}
