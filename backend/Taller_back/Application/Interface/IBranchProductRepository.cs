using Taller_back.Domain;

namespace Taller_back.Application.Interface
{
    public interface IBranchProductRepository
    {
        Task AddAsync(BranchProduct branchProduct);
        Task<List<BranchProduct>> GetByBranchAsync(int idBranch);
        Task RemoveByProductIdAsync(int productId);
    }
}