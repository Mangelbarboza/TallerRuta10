namespace Taller_back.Domain
{
    public class Service
    {
        public int IdService { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public bool IsActive { get; set; }
        public ICollection<BranchService> BranchServices { get; set; }

        public ICollection<AppointmentService> AppointmentServices { get; set; }

        public int? IdOffer { get; set; }
        public Offer? Offer { get; set; }
    }
}
