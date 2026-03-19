namespace Backend_tienda.Models
{
    /// <summary>
    /// Representa un pedido realizado por un cliente
    /// </summary>
    public class Pedido
    {
        /// <summary>
        /// Identificador único del pedido
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Fecha en que se realizó el pedido
        /// </summary>
        public DateTime Fecha { get; set; }

        /// <summary>
        /// Clave foránea: Referencia al cliente
        /// </summary>
        public int ClienteId { get; set; }

        /// <summary>
        /// Relación: Referencia al cliente que realizó el pedido
        /// </summary>
        public Cliente? Cliente { get; set; }

        /// <summary>
        /// Monto total del pedido (suma de subtotales)
        /// </summary>
        public decimal Total { get; set; }

        /// <summary>
        /// Relación: Un pedido puede tener muchos detalles
        /// </summary>
        public ICollection<DetallePedido> Detalles { get; set; } = new List<DetallePedido>();
    }
}
