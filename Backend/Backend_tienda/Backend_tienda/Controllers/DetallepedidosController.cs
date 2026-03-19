using Backend_tienda.Data;
using Backend_tienda.DTOs;
using Backend_tienda.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend_tienda.Controllers
{
    /// <summary>
    /// Controlador para gestionar detalles de pedidos
    /// Rutas: /api/detallepedidos
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class DetallepedidosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DetallepedidosController> _logger;

        public DetallepedidosController(ApplicationDbContext context, ILogger<DetallepedidosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene todos los detalles de pedidos
        /// GET: /api/detallepedidos
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<DetallePedidoDto>>> ObtenerDetalles()
        {
            try
            {
                var detalles = await _context.DetallesPedidos
                    .Include(d => d.Producto)
                    .ToListAsync();

                var detallesDto = detalles.Select(d => new DetallePedidoDto
                {
                    Id = d.Id,
                    PedidoId = d.PedidoId,
                    ProductoId = d.ProductoId,
                    NombreProducto = d.Producto?.Nombre,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario,
                    Subtotal = d.Subtotal
                }).ToList();

                return Ok(detallesDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener detalles: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al obtener los detalles" });
            }
        }

        /// <summary>
        /// Obtiene detalles de un pedido específico
        /// GET: /api/detallepedidos/porpedido/{pedidoId}
        /// </summary>
        [HttpGet("porpedido/{pedidoId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<DetallePedidoDto>>> ObtenerDetallesPorPedido(int pedidoId)
        {
            try
            {
                var detalles = await _context.DetallesPedidos
                    .Include(d => d.Producto)
                    .Where(d => d.PedidoId == pedidoId)
                    .ToListAsync();

                if (detalles.Count == 0)
                    return NotFound(new { mensaje = "No hay detalles para este pedido" });

                var detallesDto = detalles.Select(d => new DetallePedidoDto
                {
                    Id = d.Id,
                    PedidoId = d.PedidoId,
                    ProductoId = d.ProductoId,
                    NombreProducto = d.Producto?.Nombre,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario,
                    Subtotal = d.Subtotal
                }).ToList();

                return Ok(detallesDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener detalles del pedido: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al obtener los detalles del pedido" });
            }
        }

        /// <summary>
        /// Obtiene un detalle de pedido por su ID
        /// GET: /api/detallepedidos/{id}
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DetallePedidoDto>> ObtenerDetalle(int id)
        {
            try
            {
                var detalle = await _context.DetallesPedidos
                    .Include(d => d.Producto)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (detalle == null)
                    return NotFound(new { mensaje = "Detalle de pedido no encontrado" });

                var detalleDto = new DetallePedidoDto
                {
                    Id = detalle.Id,
                    PedidoId = detalle.PedidoId,
                    ProductoId = detalle.ProductoId,
                    NombreProducto = detalle.Producto?.Nombre,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario,
                    Subtotal = detalle.Subtotal
                };

                return Ok(detalleDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener detalle: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al obtener el detalle" });
            }
        }

        /// <summary>
        /// Nota: Los detalles de pedidos se crean directamente al crear un pedido
        /// Este endpoint es para actualizar la cantidad de un detalle específico
        /// PUT: /api/detallepedidos/{id}
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DetallePedidoDto>> ActualizarDetalle(int id, CrearDetallePedidoDto dto)
        {
            try
            {
                if (dto.Cantidad <= 0)
                    return BadRequest(new { mensaje = "La cantidad debe ser mayor a 0" });

                var detalle = await _context.DetallesPedidos
                    .Include(d => d.Producto)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (detalle == null)
                    return NotFound(new { mensaje = "Detalle de pedido no encontrado" });

                var diferenciaCantidad = dto.Cantidad - detalle.Cantidad;

                // Verificar stock suficiente
                if (diferenciaCantidad > 0 && detalle.Producto!.Stock < diferenciaCantidad)
                    return BadRequest(new { mensaje = "Stock insuficiente para aumentar la cantidad" });

                detalle.Cantidad = dto.Cantidad;
                detalle.Subtotal = detalle.Cantidad * detalle.PrecioUnitario;

                // Actualizar stock
                if (detalle.Producto != null)
                {
                    detalle.Producto.Stock -= diferenciaCantidad;
                }

                // Actualizar total del pedido
                var pedido = await _context.Pedidos
                    .Include(p => p.Detalles)
                    .FirstOrDefaultAsync(p => p.Id == detalle.PedidoId);

                if (pedido != null)
                {
                    pedido.Total = pedido.Detalles.Sum(d => d.Subtotal);
                }

                _context.DetallesPedidos.Update(detalle);
                await _context.SaveChangesAsync();

                var detalleDto = new DetallePedidoDto
                {
                    Id = detalle.Id,
                    PedidoId = detalle.PedidoId,
                    ProductoId = detalle.ProductoId,
                    NombreProducto = detalle.Producto?.Nombre,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario,
                    Subtotal = detalle.Subtotal
                };

                return Ok(detalleDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al actualizar detalle: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al actualizar el detalle" });
            }
        }

        /// <summary>
        /// Elimina un detalle de pedido
        /// DELETE: /api/detallepedidos/{id}
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> EliminarDetalle(int id)
        {
            try
            {
                var detalle = await _context.DetallesPedidos
                    .Include(d => d.Producto)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (detalle == null)
                    return NotFound(new { mensaje = "Detalle de pedido no encontrado" });

                // Restaurar stock
                if (detalle.Producto != null)
                {
                    detalle.Producto.Stock += detalle.Cantidad;
                }

                // Actualizar total del pedido
                var pedido = await _context.Pedidos
                    .Include(p => p.Detalles)
                    .FirstOrDefaultAsync(p => p.Id == detalle.PedidoId);

                if (pedido != null)
                {
                    pedido.Total -= detalle.Subtotal;
                }

                _context.DetallesPedidos.Remove(detalle);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Detalle de pedido eliminado correctamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al eliminar detalle: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al eliminar el detalle" });
            }
        }
    }
}
