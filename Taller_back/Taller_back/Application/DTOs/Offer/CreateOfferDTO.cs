namespace Taller_back.Application.DTOs.Offer
{

        public class CreateOfferDto
        {
            public DateTime StartDate { get; set; }

            public DateTime EndDate { get; set; }

            public decimal Discount { get; set; }
        }
    }
