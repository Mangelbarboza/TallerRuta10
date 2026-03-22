namespace Taller_back.Application.DTOs.Branch
{
    public class UpdateBranchDTO
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Schedule { get; set; }
        public IFormFile? Image { get; set; }
    }
}
