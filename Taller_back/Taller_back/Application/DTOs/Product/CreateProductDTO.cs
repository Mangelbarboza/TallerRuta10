using Taller_back.Application.DTOs.Branch;
namespace Taller_back.Application.DTOs.Product
{
    public class CreateProductDTO
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal SalePrice { get; set; }
        public int IdSupplier { get; set; }
        public List<BranchStockDTO> Branches { get; set; } = new();
        public IFormFile? Image { get; set; }
    }
}
