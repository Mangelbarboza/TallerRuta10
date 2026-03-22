using Microsoft.EntityFrameworkCore;
using Taller_back.Application.DTOs.Branch;
using Taller_back.Application.DTOs.ServiceDTOs;
using Taller_back.Application.Interface;
using Taller_back.Infraestructure;

namespace Taller_back.Application.Services
{
    public class BranchServiceService : IBranchServiceService
    {
        private readonly ApplicationDBContext _context;

        public BranchServiceService(ApplicationDBContext context) { 
            _context = context;
        }
        public async Task AddServiceToBranch(int idBranch, int idService)
        {
            var relation = await _context.BranchServices.FirstOrDefaultAsync(bs=>bs.IdBranch == idBranch && bs.IdService == idService);

            if (relation != null) { 
                if(relation.IsActive == false)
                {
                    relation.IsActive = true;
                    await _context.SaveChangesAsync();
                }
                return;
            }

            _context.BranchServices.Add(new Domain.BranchService
            {
                IdBranch = idBranch,
                IdService = idService,
                IsActive = true
            });

            await _context.SaveChangesAsync();
        }

        public async Task DeleteServiceFromBranch(int idBranch, int idService)
        {
            var relation = await _context.BranchServices.FirstOrDefaultAsync(bs => bs.IdBranch == idBranch && bs.IdService == idService && bs.IsActive);

            if (relation == null) {
                throw new Exception("El servicio no está asociado a la sucursal");
            }

            relation.IsActive = false;
            await _context.SaveChangesAsync();
        }

        public async Task<List<BranchDTO>> GetBranchesByServiceAsync(int serviceId)
        {
            return await _context.BranchServices
                .Where(bs => bs.IdService == serviceId && bs.IsActive)
                .Include(bs => bs.Branch)
                .Select(bs => new BranchDTO
                {
                    IdBranch = bs.Branch.IdBranch,
                    Name = bs.Branch.Name,
                    Address = bs.Branch.Address,
                    IsActive = bs.Branch.IsActive
                })
                .ToListAsync();
        }

        public async Task<List<ServiceDTO>> GetServicesByBranchAsync(int idBranch)
        {
            return await _context.BranchServices
                .Where(bs => bs.IdBranch == idBranch && bs.IsActive)
                .Include(bs => bs.Service)
                .Select(bs => new ServiceDTO
                {
                    IdService = bs.Service.IdService,
                    Name = bs.Service.Name,
                    Description = bs.Service.Description,
                    BasePrice = bs.Service.BasePrice,
                    IsActive = bs.IsActive
                })
                .ToListAsync();
        }
    }
}
