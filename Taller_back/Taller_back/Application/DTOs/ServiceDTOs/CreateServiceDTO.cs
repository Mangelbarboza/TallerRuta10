namespace Taller_back.Application.DTOs.ServiceDTOs
{
    public class CreateServiceDTO
    {
            public string Name { get; set; } = null!;
            public string? Description { get; set; }
            public decimal BasePrice { get; set; }
            public List<int> BranchIds { get; set; } = new();

    }
}
