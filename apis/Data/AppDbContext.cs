using Microsoft.EntityFrameworkCore;
using apis.Models;

namespace apis.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Category>().ToTable("Categories");
            modelBuilder.Entity<Order>().ToTable("Orders");
            modelBuilder.Entity<OrderItem>().ToTable("OrderItems");

            // Seed Initial Data
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "admin", Email = "admin@proj2.local", PasswordHash = "admin123", Role = "Admin" },
                new User { Id = 2, Username = "johndoe", Email = "john@example.com", PasswordHash = "user123", Role = "User" },
                new User { Id = 3, Username = "ahmedraza", Email = "ahmedraza@proj2.local", PasswordHash = "ahmedraza", Role = "Admin" }
            );

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Hardware & Devices", Description = "Networking gear, gadgets, and physical hardware" },
                new Category { Id = 2, Name = "Software & Cloud Services", Description = "SaaS subscriptions, enterprise software, and dev tools" },
                new Category { Id = 3, Name = "DevOps Tools", Description = "Monitoring, CI/CD, and container management utilities" }
            );

            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Cloud Server Plan A", Description = "Scalable enterprise cloud instance with 8 vCPUs and 32GB RAM", Price = 49.99m, StockQuantity = 100, CategoryId = 2 },
                new Product { Id = 2, Name = "DevOps Observability Toolkit", Description = "Real-time APM, logging, and infrastructure monitoring platform", Price = 199.00m, StockQuantity = 50, CategoryId = 3 },
                new Product { Id = 3, Name = "High-Speed Mesh Router X", Description = "Gigabit WiFi 6 Mesh Router with built-in VPN server", Price = 129.50m, StockQuantity = 30, CategoryId = 1 },
                new Product { Id = 4, Name = "Managed Database Pro", Description = "High availability MySQL database cluster with daily backups", Price = 89.99m, StockQuantity = 75, CategoryId = 2 }
            );
        }
    }
}
