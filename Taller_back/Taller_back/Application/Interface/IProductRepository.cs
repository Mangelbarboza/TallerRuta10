using Taller_back.Domain;

namespace Taller_back.Application.Interface
{
    public interface IProductRepository
    {
        Task AddAsync(Product product);
        Task<List<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task UpdateAsync(Product product);

        Task<Product?> GetByIdWithBranchesAsync(int id);
    }
}
