using Microsoft.OpenApi.Models;
using System.Reflection;

namespace Backend_tienda.Configuration
{
    /// <summary>
    /// Configuración de Swagger/OpenAPI para la documentación de la API
    /// </summary>
    public static class SwaggerConfiguration
    {
        /// <summary>
        /// Configura Swagger con información detallada de la API
        /// </summary>
        public static void AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                // Información general de la API
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "API El Reino del Fútbol",
                    Version = "v1.0.0",
                    Description = "API REST para gestionar una tienda de productos de fútbol",
                    Contact = new OpenApiContact
                    {
                        Name = "Equipo de Desarrollo",
                        Email = "soporte@reinodelfutbol.com"
                    },
                    License = new OpenApiLicense
                    {
                        Name = "MIT",
                        Url = new Uri("https://opensource.org/licenses/MIT")
                    }
                });

                // Incluir comentarios XML de los controladores
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    c.IncludeXmlComments(xmlPath);
                }
            });
        }
    }
}
