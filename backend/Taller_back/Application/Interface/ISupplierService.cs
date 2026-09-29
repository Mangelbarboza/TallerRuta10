using Taller_back.Application.DTOs.Branch;
using Taller_back.Application.DTOs.Supplier;

namespace Taller_back.Application.Interface
{
    public interface ISupplierService
    {
        Task<List<SupplierDTO>> GetAllAsync();
        Task CreateAsync(CreateSupplierDTO dto);
        Task UpdateAsync(int id, UpdateSupplierDTO dto);
        Task DeleteAsync(int id);
    }
}
