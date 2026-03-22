using Microsoft.EntityFrameworkCore;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Infraestructure.Repository
{
    public class OfferRepository : IOfferRepository
    {

        private readonly ApplicationDBContext _context;

        public OfferRepository (ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Offer> CreateAsync(Offer offer)
        {
            _context.Offers.Add(offer);
            await _context.SaveChangesAsync();
            return offer;
        }

        public async Task<List<Offer>> getActiveAsync()
        {

            var today = DateTime.Today;

            return await _context.Offers
                .Where(o =>
                o.IsActive
                )
                .OrderByDescending(o => o.StartDate )
                .ToListAsync();
        }

        public async Task<List<Offer>> getAllAsync()
        {
            return await _context.Offers
                .OrderByDescending(o => o.StartDate)
                .ToListAsync();
        }
        public async Task<Offer?> GetByIdAsync(int idOffer)
        {
            return await _context.Offers
                .FirstOrDefaultAsync(o => o.IdOffer == idOffer);
        }

        public async Task UpdateAsync(Offer offer)
        {
            _context.Offers.Update(offer);
            await _context.SaveChangesAsync();
        }
    }
}
