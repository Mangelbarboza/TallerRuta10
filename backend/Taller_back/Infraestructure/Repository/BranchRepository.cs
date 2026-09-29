using Microsoft.EntityFrameworkCore;
using System;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Infraestructure.Repository
{
    public class BranchRepository: IBranchRepository
    {
        private readonly ApplicationDBContext _context;

        public BranchRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Branch>> GetAllAsync()
        {
            return await _context.Branches.ToListAsync();
        }

        public async Task<Branch?> GetByIdAsync(int id)
        {
            return await _context.Branches.FindAsync(id);
        }

        public async Task AddAsync(Branch branch)
        {
            _context.Branches.Add(branch);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Branch branch)
        {
            _context.Branches.Update(branch);
            await _context.SaveChangesAsync();
        }
    }
}
