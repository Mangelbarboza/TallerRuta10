using Taller_back.Application.DTOs.ServiceDTOs;
using Taller_back.Application.Interface;
using Taller_back.Domain;
using Taller_back.Infraestructure.Repository;

namespace Taller_back.Application.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IBranchServiceService _branchServiceService;

        public ServiceService(
        IServiceRepository serviceRepository,
        IBranchServiceService branchServiceService)
        {
            _serviceRepository = serviceRepository;
            _branchServiceService = branchServiceService;
        }

        public async Task<List<ServiceDTO>> GetAllAsync()
        {
            var services = await _serviceRepository.GetAllAsync();
            return services.Select(s => new ServiceDTO
            {
                IdService = s.IdService,
                Name = s.Name,
                Description = s.Description,
                BasePrice = s.BasePrice,
                IsActive = s.IsActive,
                IdOffer = s.IdOffer,
                Discount = s.Offer != null ? s.Offer.Discount : null,
                BranchIds = new List<int>()
            }).ToList();
        }

        public async Task CreateAsync(CreateServiceDTO dto)
        {
            var entity = new Service
            {
                Name = dto.Name,
                Description = dto.Description,
                BasePrice = dto.BasePrice,
                IsActive = true
            };

            await _serviceRepository.AddAsync(entity);
            //Asociar sucursales
            foreach (var branchId in dto.BranchIds)
            {
                await _branchServiceService.AddServiceToBranch(branchId, entity.IdService);
            }
        }

        public async Task<bool> UpdateAsync(int id, Service updatedService)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null) return false;

            service.Name = updatedService.Name;
            service.Description = updatedService.Description;
            service.BasePrice = updatedService.BasePrice;

            await _serviceRepository.UpdateAsync(service);
            return true;
        }


        public async Task<bool> UpdateAsync(int id, UpdateServiceDTO dto)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null) return false;

            service.Name = dto.Name;
            service.Description = dto.Description;
            service.BasePrice = dto.BasePrice;
            service.IdOffer = dto.IdOffer;

            await _serviceRepository.UpdateAsync(service);
            // Obtener sucursales actuales
            var currentBranches = await _branchServiceService.GetBranchesByServiceAsync(id);
            var currentIds = currentBranches.Select(b => b.IdBranch).ToList();

            // Agregar nuevas
            foreach (var branchId in dto.BranchIds.Except(currentIds))
            {
                await _branchServiceService.AddServiceToBranch(branchId, id);
            }

            // Quitar las que ya no están
            foreach (var branchId in currentIds.Except(dto.BranchIds))
            {
                await _branchServiceService.DeleteServiceFromBranch(branchId, id);
            }

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null) return false;

            service.IsActive = false;
            await _serviceRepository.UpdateAsync(service);
            return true;
        }
        public async Task<ServiceDTO?> GetByIdAsync(int id)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null) return null;

            var branches = await _branchServiceService.GetBranchesByServiceAsync(id);

            return new ServiceDTO
            {
                IdService = service.IdService,
                Name = service.Name,
                Description = service.Description,
                BasePrice = service.BasePrice,
                IsActive = service.IsActive,
                IdOffer = service.IdOffer,
                Discount = service.Offer?.Discount,
                BranchIds = branches.Select(b => b.IdBranch).ToList()
            };
        }
    }
}
