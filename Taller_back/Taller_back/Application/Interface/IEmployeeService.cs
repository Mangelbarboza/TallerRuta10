using Taller_back.Application.DTOs.Employee;

namespace Taller_back.Application.Interface
{
    public interface IEmployeeService
    {
        Task<List<EmployeeDTO>> GetAllAsync();
        Task<EmployeeDTO?> GetByIdAsync(int id);
        Task<EmployeeDTO> CreateAsync(CreateEmployeeDTO dto);
        Task<bool> UpdateAsync(int id, UpdateEmployeeDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
