namespace Backend_tienda.Utilities
{
    /// <summary>
    /// Clase genérica para envolver todas las respuestas de la API
    /// Proporciona una estructura consistente y predecible para el frontend
    /// </summary>
    public class ApiResponse<T>
    {
        /// <summary>
        /// Indica si la operación fue exitosa
        /// true = éxito, false = error
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Mensaje descriptivo de la operación
        /// Ejemplos: "Categoría creada exitosamente", "Error: El email ya existe"
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Datos de la respuesta (el objeto o lista que se devuelve)
        /// Es null si hay error
        /// </summary>
        public T? Data { get; set; }

        /// <summary>
        /// Lista de errores de validación
        /// Se usa cuando hay múltiples errores en los datos
        /// </summary>
        public List<string>? Errors { get; set; }

        /// <summary>
        /// Código de estado HTTP
        /// 200=OK, 201=Created, 400=BadRequest, 404=NotFound, 500=ServerError
        /// </summary>
        public int StatusCode { get; set; }

        /// <summary>
        /// Constructor vacío (para deserialización)
        /// </summary>
        public ApiResponse() { }

        /// <summary>
        /// Constructor para respuestas exitosas
        /// </summary>
        public ApiResponse(bool success, string message, T? data, int statusCode = 200)
        {
            Success = success;
            Message = message;
            Data = data;
            StatusCode = statusCode;
        }

        /// <summary>
        /// Constructor para respuestas con errores
        /// </summary>
        public ApiResponse(bool success, string message, List<string>? errors, int statusCode = 400)
        {
            Success = success;
            Message = message;
            Errors = errors;
            StatusCode = statusCode;
        }

        /// <summary>
        /// Crea una respuesta exitosa (GET, POST, PUT exitoso)
        /// </summary>
        public static ApiResponse<T> SuccessResponse(T? data, string message = "Operación exitosa", int statusCode = 200)
        {
            return new ApiResponse<T>(true, message, data, statusCode);
        }

        /// <summary>
        /// Crea una respuesta de error
        /// </summary>
        public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null, int statusCode = 400)
        {
            return new ApiResponse<T>(false, message, errors, statusCode);
        }

        /// <summary>
        /// Crea una respuesta de error no encontrado (404)
        /// </summary>
        public static ApiResponse<T> NotFoundResponse(string message = "Recurso no encontrado")
        {
            return new ApiResponse<T>(false, message, new List<string> { message }, 404);
        }

        /// <summary>
        /// Crea una respuesta de error del servidor (500)
        /// </summary>
        public static ApiResponse<T> ServerErrorResponse(string message = "Error interno del servidor")
        {
            return new ApiResponse<T>(false, message, new List<string> { message }, 500);
        }
    }
}
