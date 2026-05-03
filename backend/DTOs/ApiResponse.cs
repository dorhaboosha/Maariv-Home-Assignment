namespace MaarivMiniApp.Api.DTOs;

/// <summary>
/// Standard envelope for every successful API response.
/// All endpoints return this shape so the frontend can always
/// expect <c>{ "success": true, "data": ... }</c> on a 2xx status code.
/// </summary>
/// <typeparam name="T">The type of the payload carried in <see cref="Data"/>.</typeparam>
public class ApiResponse<T>
{
    /// <summary>Always <c>true</c> for success responses.</summary>
    public bool Success { get; set; }

    /// <summary>The response payload.</summary>
    public T? Data { get; set; }

    /// <summary>
    /// Creates a successful response wrapping the given <paramref name="data"/>.
    /// </summary>
    public static ApiResponse<T> Ok(T data) => new() { Success = true, Data = data };
}
