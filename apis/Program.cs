using Microsoft.EntityFrameworkCore;
using apis.Data;
using apis.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Register Custom Services
builder.Services.AddScoped<IAuthService, AuthService>();

// 3. Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMonorepoApps", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Configure MySQL EF Core DbContext with fallback version
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Port=3306;Database=proj2_db;Uid=root;Pwd=rootpassword;";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30)), mysqlOptions =>
    {
        mysqlOptions.EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(5), errorNumbersToAdd: null);
    });
});

var app = builder.Build();

// 5. Configure HTTP Request Pipeline
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", ".NET REST API v1");
    });
}

app.UseCors("AllowMonorepoApps");

app.UseAuthorization();

app.MapControllers();

app.Run("http://localhost:5005");
