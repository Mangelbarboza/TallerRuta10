namespace Taller_back.Domain
{
    public class Offer
    {

        public int IdOffer { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Discount { get; set; }
        public bool IsActive { get; set; }

    }
}
