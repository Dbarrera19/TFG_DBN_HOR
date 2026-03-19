namespace Backend_tienda.Models
{
    /// <summary>
    /// Representa un producto dentro de un pedido
    /// </summary>
    public class DetallePedido
    {
        /// <summary>
        /// Identificador único del detalle
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Clave foránea: Referencia al pedido
        /// </summary>
        public int PedidoId { get; set; }

        /// <summary>
        /// Relación: Referencia al pedido
        /// </summary>
        public Pedido? Pedido { get; set; }

        /// <summary>
        /// Clave foránea: Referencia al producto
        /// </summary>
        public int ProductoId { get; set; }

        /// <summary>
        /// Relación: Referencia al producto
        /// </summary>
        public Producto? Producto { get; set; }

        /// <summary>
        /// Cantidad de unidades del producto en este detalle
        /// </summary>
        public int Cantidad { get; set; }

        /// <summary>
        /// Precio unitario del producto en el momento de la compra
        /// </summary>
        public decimal PrecioUnitario { get; set; }

        /// <summary>
        /// Subtotal del detalle (Cantidad × PrecioUnitario)
        /// Se calcula automáticamente
        /// </summary>
        public decimal Subtotal { get; set; }
    }
}
