namespace Taller_back.Application.DTOs.Supplier
{
    public class SupplierDTO
    {
        public int IdSupplier { get; set; }
        public string Name { get; set; }
        public string PhoneNumer { get; set; }
        public string Email { get; set; }
        public string Manager { get; set; }
        public bool IsActive { get; set; }
    }
}
