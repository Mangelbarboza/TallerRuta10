using Taller_back.Application.DTOs.Employee;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<List<EmployeeDTO>> GetAllAsync()
        {
            var employees = await _employeeRepository.GetAllAsync();
            return employees.Select(MapToDTO).ToList();
        }

        public async Task<EmployeeDTO?> GetByIdAsync(int id)
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            return employee == null ? null : MapToDTO(employee);
        }

        public async Task<EmployeeDTO> CreateAsync(CreateEmployeeDTO dto)
        {
            if (dto.IdBranch <= 0)
                throw new InvalidOperationException("Debe asignar una sucursal válida al empleado.");

            var branchOk = await _employeeRepository.BranchExistsAndActiveAsync(dto.IdBranch);
            if (!branchOk)
                throw new InvalidOperationException("La sucursal asignada no existe o está inactiva.");

            var employee = new Employee
            {
                Name = dto.Name,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Position = dto.Position,
                IdBranch = dto.IdBranch,
                IsActive = true
            };

            var created = await _employeeRepository.CreateAsync(employee);
            var loaded = await _employeeRepository.GetByIdAsync(created.IdEmployee);

            if (loaded == null)
                throw new InvalidOperationException("El empleado se creó, pero no se pudo cargar para devolverlo.");

            return MapToDTO(loaded);
        }

        public async Task<bool> UpdateAsync(int id, UpdateEmployeeDTO dto)
        {
            if (dto.IdBranch <= 0)
                throw new InvalidOperationException("Debe asignar una sucursal válida al empleado.");

            var branchOk = await _employeeRepository.BranchExistsAndActiveAsync(dto.IdBranch);
            if (!branchOk)
                throw new InvalidOperationException("La sucursal asignada no existe o está inactiva.");

            var existing = await _employeeRepository.GetByIdAsync(id);
            if (existing == null) return false;

            var employee = new Employee
            {
                IdEmployee = id,
                Name = dto.Name,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Position = dto.Position,
                IdBranch = dto.IdBranch,
                IsActive = dto.IsActive
            };

            return await _employeeRepository.UpdateAsync(employee);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _employeeRepository.GetByIdAsync(id);
            if (existing == null) return false;

            var employee = new Employee
            {
                IdEmployee = existing.IdEmployee,
                Name = existing.Name,
                PhoneNumber = existing.PhoneNumber,
                Email = existing.Email,
                Position = existing.Position,
                IdBranch = existing.IdBranch,
                IsActive = false
            };

            return await _employeeRepository.UpdateAsync(employee);
        }

        private static EmployeeDTO MapToDTO(Employee e)
        {
            return new EmployeeDTO
            {
                IdEmployee = e.IdEmployee,
                Name = e.Name,
                PhoneNumber = e.PhoneNumber,
                Email = e.Email,
                Position = e.Position,
                IdBranch = e.IdBranch,
                IsActive = e.IsActive,
                Branch = e.Branch == null ? null : new EmployeeBranchDTO
                {
                    IdBranch = e.Branch.IdBranch,
                    Name = e.Branch.Name,
                    Address = e.Branch.Address,
                    Phone = e.Branch.Phone,
                    Email = e.Branch.Email,
                    Schedule = e.Branch.Schedule,
                    Image = e.Branch.Image,
                    IsActive = e.Branch.IsActive
                }
            };
        }
    }
}
