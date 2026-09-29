using Taller_back.Application.DTOs.ServiceDTOs;
using Taller_back.Domain;

namespace Taller_back.Application.Interface
{
    public interface IServiceRepository
    {
        Task<List<Service>> GetAllAsync();
        Task<Service?> GetByIdAsync(int id);
        Task AddAsync(Service service);
        Task UpdateAsync(Service service);
    }

}
