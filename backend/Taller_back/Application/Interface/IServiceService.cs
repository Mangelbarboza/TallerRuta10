using Taller_back.Application.DTOs.ServiceDTOs;
using Taller_back.Domain;

namespace Taller_back.Application.Interface
{
    public interface IServiceService
    {
        Task<List<ServiceDTO>> GetAllAsync();
        Task CreateAsync(CreateServiceDTO service);
        Task<bool> UpdateAsync(int id, UpdateServiceDTO dto);
         Task<bool> DeleteAsync(int id);
        Task<ServiceDTO?> GetByIdAsync(int id);
    }
}
