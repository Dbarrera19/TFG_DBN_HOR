namespace Backend_tienda.DTOs
{
    /// <summary>
    /// DTO para crear o actualizar una categoría
    /// No incluye el Id ya que se genera automáticamente
    /// </summary>
    public class CrearActualizarCategoriaDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO para devolver datos de una categoría
    /// Incluye todos los campos
    /// </summary>
    public class CategoriaDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
    }
}
