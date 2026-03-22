using Taller_back.Application.DTOs.Product;

namespace Taller_back.Application.Interface
{
    public interface IProductService
    {
        Task CreateAsync(CreateProductDTO dto);
        Task<List<ProductDTO>> GetAllAsync();
        Task<UpdateProductDTO?> GetByIdAsync(int id);
        Task<bool> UpdateAsync(int id, UpdateProductDTO dto);
        Task<bool> DeleteAsync(int id);

    }

}
