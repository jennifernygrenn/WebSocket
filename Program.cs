using ChatApp.Hubs;
using ChatApp.DataService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddSingleton<SharedDb>();

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;  // Få bättre felmeddelanden
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("reactapp", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("reactapp");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub").RequireCors("reactapp");

app.Run();


