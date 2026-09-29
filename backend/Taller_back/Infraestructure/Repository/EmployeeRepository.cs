using Microsoft.EntityFrameworkCore;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Infraestructure.Repository
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDBContext _context;

        public EmployeeRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Employee>> GetAllAsync()
        {
            return await _context.Set<Employee>()
                .AsNoTracking()
                .Include(e => e.Branch)
                .Where(e => e.IsActive)
                .ToListAsync();
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Set<Employee>()
                .AsNoTracking()
                .Include(e => e.Branch)
                .FirstOrDefaultAsync(e => e.IdEmployee == id && e.IsActive);
        }

        public async Task<Employee> CreateAsync(Employee employee)
        {
            _context.Set<Employee>().Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task<bool> UpdateAsync(Employee employee)
        {
            _context.Set<Employee>().Update(employee);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> BranchExistsAndActiveAsync(int idBranch)
        {
            return await _context.Set<Branch>()
                .AsNoTracking()
                .AnyAsync(b => b.IdBranch == idBranch && b.IsActive);
        }
    }
}
