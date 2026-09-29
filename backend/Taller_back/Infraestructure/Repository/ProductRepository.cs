using Microsoft.EntityFrameworkCore;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Infraestructure.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDBContext _context;

        public ProductRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(p => p.Supplier)
                .Include(p => p.Offer)
                .Where(p => p.IsActive)   
                .ToListAsync();
        }


        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.IdProduct == id && p.IsActive);
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }
        public async Task<Product?> GetByIdWithBranchesAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Supplier)
                .Include(p => p.BranchProducts)
                .Include(p => p.Offer)
                .FirstOrDefaultAsync(p => p.IdProduct == id);
        }
    }
}
