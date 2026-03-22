using Taller_back.Application.DTOs.Branch;

namespace Taller_back.Application.Interface
{
    public interface IBranchService
    {
        Task<List<BranchDTO>> GetAllAsync();
        Task CreateAsync(CreateBranchDTO dto);
        Task UpdateAsync(int id, UpdateBranchDTO dto);
        Task DeleteAsync(int id);
    }

}
