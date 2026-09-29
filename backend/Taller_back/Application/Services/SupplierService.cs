using Taller_back.Application.DTOs.Branch;
using Taller_back.Application.DTOs.Supplier;
using Taller_back.Application.Interface;
using Taller_back.Domain;
using Taller_back.Infraestructure.Repository;

namespace Taller_back.Application.Services
{
    public class SupplierService: ISupplierService
    {
        private readonly ISupplierRepository _supplierRepository;

        public SupplierService(ISupplierRepository supplierRepository)
        {
            _supplierRepository = supplierRepository;
        }

        public async Task CreateAsync(CreateSupplierDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Phone) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Manager))
            {
                throw new Exception("Todos los campos del proveedor son obligatorios");
            }

            var supplier = new Supplier
            {
                Name = dto.Name,
                Phone = dto.Phone,
                Email = dto.Email,
                Manager = dto.Manager,
                IsActive = true
            };

            await _supplierRepository.AddAsync(supplier);
        }

        public async Task DeleteAsync(int id)
        {
            var supplier = await _supplierRepository.GetByIdAsync(id);

            if(supplier == null) { return ; }

            if (supplier.IsActive == true) { 
                supplier.IsActive = false;
            }

            await _supplierRepository.UpdateAsync(supplier);
        }

        public async Task<List<SupplierDTO>> GetAllAsync()
        {
            var suppliers = await _supplierRepository.GetAllAsync();

            return suppliers.Where(s => s.IsActive).Select(b => new SupplierDTO
            {
                IdSupplier = b.IdSupplier,
                Name = b.Name,
                PhoneNumer = b.Phone,
                Email = b.Email,
                Manager = b.Manager,
                IsActive = b.IsActive
            }).ToList();
        }

        public async Task UpdateAsync(int id, UpdateSupplierDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Phone) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Manager))
            {
                throw new Exception("Los campos del proveedor no pueden quedar vacíos");
            }

            var supplier =  await _supplierRepository.GetByIdAsync(id);

            if(supplier == null) { return; }

            supplier.Name = dto.Name;
            supplier.Phone = dto.Phone;
            supplier.Email = dto.Email;
            supplier.Manager = dto.Manager;

            await _supplierRepository.UpdateAsync(supplier);
        }
    }
}
