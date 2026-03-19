namespace Backend_tienda.Models
{
    /// <summary>
    /// Representa una categoría de productos
    /// </summary>
    public class Categoria
    {
        /// <summary>
        /// Identificador único de la categoría
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nombre de la categoría (ej: Camisetas, Balones, etc.)
        /// </summary>
        public string Nombre { get; set; } = string.Empty;

        /// <summary>
        /// Descripción de la categoría
        /// </summary>
        public string Descripcion { get; set; } = string.Empty;

        /// <summary>
        /// Relación: Una categoría puede tener muchos productos
        /// </summary>
        public ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }
}
