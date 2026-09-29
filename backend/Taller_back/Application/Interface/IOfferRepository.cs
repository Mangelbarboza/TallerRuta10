using Taller_back.Domain;

namespace Taller_back.Application.Interface
{

    // Alt + 60 = <

    // Alt + 62 = > 


    public interface IOfferRepository
    {
        Task<Offer> CreateAsync(Offer offer);
        Task<List<Offer>> getAllAsync();
        Task<List<Offer>> getActiveAsync();
        Task<Offer?> GetByIdAsync(int idOffer);
        Task UpdateAsync(Offer offer);

    }
}
