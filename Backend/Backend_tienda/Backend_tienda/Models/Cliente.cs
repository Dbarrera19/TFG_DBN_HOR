namespace Backend_tienda.Models
{
    /// <summary>
    /// Representa un cliente de la tienda
    /// </summary>
    public class Cliente
    {
        /// <summary>
        /// Identificador único del cliente
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nombre del cliente
        /// </summary>
        public string Nombre { get; set; } = string.Empty;

        /// <summary>
        /// Apellido del cliente
        /// </summary>
        public string Apellido { get; set; } = string.Empty;

        /// <summary>
        /// Correo electrónico del cliente
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Número de teléfono del cliente
        /// </summary>
        public string Telefono { get; set; } = string.Empty;

        /// <summary>
        /// Dirección de envío del cliente
        /// </summary>
        public string Direccion { get; set; } = string.Empty;

        /// <summary>
        /// Relación: Un cliente puede tener muchos pedidos
        /// </summary>
        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }
}
