namespace Taller_back.Infraestructure.Repository
{
    using Microsoft.EntityFrameworkCore;
    using Taller_back.Application.Interface;
    using Taller_back.Domain;

    public class BranchProductRepository : IBranchProductRepository
    {
        private readonly ApplicationDBContext _context;

        public BranchProductRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task AddAsync(BranchProduct branchProduct)
        {
            await _context.BranchProducts.AddAsync(branchProduct);
            await _context.SaveChangesAsync();
        }

        public async Task<List<BranchProduct>> GetByBranchAsync(int idBranch)
        {
            return await _context.BranchProducts
                .Include(bp => bp.Product)
                .Where(bp => bp.IdBranch == idBranch)
                .ToListAsync();
        }
        public async Task RemoveByProductIdAsync(int productId)
        {
            var branchProducts = await _context.BranchProducts
                .Where(bp => bp.IdProduct == productId)
                .ToListAsync();

            _context.BranchProducts.RemoveRange(branchProducts);

            await _context.SaveChangesAsync();
        }
    }

}
