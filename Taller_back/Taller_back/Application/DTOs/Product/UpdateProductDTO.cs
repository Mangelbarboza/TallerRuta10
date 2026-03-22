using Taller_back.Application.DTOs.Branch;

namespace Taller_back.Application.DTOs.Product
{
    public class UpdateProductDTO
    {
        public int IdProduct { get; set; }

        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal SalePrice { get; set; }

        public int IdSupplier { get; set; }

        public List<BranchStockDTO> Branches { get; set; } = new();

        public IFormFile? Image { get; set; }
        public int? IdOffer { get; set; }
        public decimal? Discount { get; set; }
        public String? ImagePath { get; set; }
    }
}
