    namespace Taller_back.Application.DTOs.OfferDTOs
    {
        public class UpdateOfferDto
        {

            public DateTime StartDate { get; set; }

            public DateTime EndDate { get; set; }


            public decimal Discount { get; set; }

            public bool IsActive { get; set; }
        }
    }
