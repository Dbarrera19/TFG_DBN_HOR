namespace Backend_tienda.DTOs
{
    public class CrearPedidoDto
    {
        public int ClienteId { get; set; }
        public List<CrearDetallePedidoDto> Detalles { get; set; } = new List<CrearDetallePedidoDto>();
    }

    public class ActualizarPedidoDto
    {
        public int ClienteId { get; set; }
    }

    public class PedidoDto
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public int ClienteId { get; set; }
        public string? NombreCliente { get; set; }
        public decimal Total { get; set; }
        public List<DetallePedidoDto> Detalles { get; set; } = new List<DetallePedidoDto>();
    }
}
