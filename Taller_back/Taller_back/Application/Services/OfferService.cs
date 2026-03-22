using Taller_back.Application.DTOs.Offer;
using Taller_back.Application.DTOs.OfferDTOs;
using Taller_back.Application.Interface;
using Taller_back.Domain;


namespace Taller_back.Application.Services
{
    public class OfferService
    {

        private readonly IOfferRepository _offerRepository;

        public OfferService(IOfferRepository offerRepository)
        {
            _offerRepository = offerRepository;
        }

        public async Task<Offer> CreateAsync(CreateOfferDto dto)
        {
            if (dto.EndDate <= dto.StartDate)
                throw new Exception("Fecha de inicio debe de ser mayor que la fecha en que termina");

            var offer = new Offer
            {
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Discount = dto.Discount,
                IsActive = true
            };
            return await _offerRepository.CreateAsync(offer);
        }
        public async Task<List<Offer>> getAllAsync()
        {
            return await _offerRepository.getAllAsync();

        }
        public async Task<List<Offer>> getActiveAsync()
        { 
        return await _offerRepository.getActiveAsync();
        }
        public async Task<Offer> UpdateAsync(int idOffer, UpdateOfferDto dto)
        {
            var offer = await _offerRepository.GetByIdAsync(idOffer);

            if (offer == null)
                throw new Exception("Oferta no encontrada");

            if (dto.EndDate < dto.StartDate)
                throw new Exception("EndDate no puede ser menor que StartDate");

            offer.StartDate = dto.StartDate.Date;
            offer.EndDate = dto.EndDate.Date;
            offer.Discount = dto.Discount;
            offer.IsActive = dto.IsActive;

            await _offerRepository.UpdateAsync(offer);

            return offer;
        }
        public async Task DeleteAsync(int idOffer)
        {
            var offer = await _offerRepository.GetByIdAsync(idOffer);

            if (offer == null)
                throw new Exception("Oferta no encontrada");

            offer.IsActive = false;

            await _offerRepository.UpdateAsync(offer);
        }

    }
}
