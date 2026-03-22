namespace Taller_back.Application.DTOs.ServiceDTOs
{
    public class ServiceDTO
    {
        public int IdService { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }  
        public bool IsActive { get; set; }
        public List<int> BranchIds { get; set; } = new();
        public int? IdOffer { get; set; }
        public decimal? Discount { get; set; }
    }

}
