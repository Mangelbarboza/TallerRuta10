using Taller_back.Application.DTOs.Client;

namespace Taller_back.Application.Interface
{
    public interface IClientService
    {
        Task<List<ClientDTO>> GetAllAsync();
        Task CreateAsync(CreateClientDTO dto);
        Task UpdateAsync(int id, UpdateClientDTO dto);
        Task DeleteAsync(int id);
    }
}
