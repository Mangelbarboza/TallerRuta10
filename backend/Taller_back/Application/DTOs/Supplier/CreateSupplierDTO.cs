namespace Taller_back.Application.DTOs.Supplier
{
    public class CreateSupplierDTO
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Manager { get; set; }
        public bool IsActive { get; set; }
    }
}
