using Taller_back.Application.DTOs.Branch;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Application.Services
{
    public class BranchService: IBranchService
    {
        private readonly IBranchRepository _branchRepository;
        private readonly IFileService _fileService;

        public BranchService(IBranchRepository branchRepository, IFileService fileService)
        {
            _branchRepository = branchRepository;
            _fileService = fileService;
        }

        public async Task<List<BranchDTO>> GetAllAsync()
        {
            var branches = await _branchRepository.GetAllAsync();

            return branches.Where(b => b.IsActive).Select(b => new BranchDTO
            {
                IdBranch = b.IdBranch,
                Name = b.Name,
                Address = b.Address,
                Phone = b.Phone,
                Email = b.Email,
                Schedule = b.Schedule,
                Image = b.Image,
                IsActive = b.IsActive
            }).ToList();
        }

        public async Task CreateAsync(CreateBranchDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Address) ||
                string.IsNullOrWhiteSpace(dto.Phone) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Schedule))
            {
                throw new Exception("Todos los campos de la sucursal son obligatorios");
            }

            string? imagePath = null;

            if (dto.Image != null) {
                imagePath = await _fileService.SaveFileAsync(dto.Image, "sucursales");
            }

            var branch = new Branch
            {
                Name = dto.Name,
                Address = dto.Address,
                Phone = dto.Phone,
                Email = dto.Email,
                Schedule = dto.Schedule,
                Image = imagePath,
                IsActive = true
            };

            await _branchRepository.AddAsync(branch);
        }

        public async Task UpdateAsync(int id, UpdateBranchDTO dto)
        {
            var branch = await _branchRepository.GetByIdAsync(id);

            if (branch == null) return;

            if (dto.Image != null) {
                if (!string.IsNullOrEmpty(branch.Image))
                {
                    await _fileService.DeleteFileAsync(branch.Image);
                }
                branch.Image = await _fileService.SaveFileAsync(dto.Image, "sucursales");
            }

            if (dto.Name != null) branch.Name = dto.Name;
            if (dto.Address != null) branch.Address = dto.Address;
            if (dto.Phone != null) branch.Phone = dto.Phone;
            if (dto.Email != null) branch.Email = dto.Email;
            if (dto.Schedule != null) branch.Schedule = dto.Schedule;

            await _branchRepository.UpdateAsync(branch);
        }

        public async Task DeleteAsync(int id) { 
            var branch = await _branchRepository.GetByIdAsync(id); if (branch == null) { return; }

            branch.IsActive = false;
            await _branchRepository.UpdateAsync(branch);
        }

    }
}
