namespace Taller_back.Application.DTOs.Product
{
    public class ProductDTO
    {
        public int IdProduct { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal SalePrice { get; set; }
        public string? Image { get; set; }
        public int IdSupplier { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public int? IdOffer { get; set; }
        public decimal? Discount { get; set; }
    }
}
