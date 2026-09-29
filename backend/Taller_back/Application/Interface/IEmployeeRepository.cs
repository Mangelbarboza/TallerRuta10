using Taller_back.Domain;

namespace Taller_back.Application.Interface
{
    public interface IEmployeeRepository
    {
        Task<List<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(int id);
        Task<Employee> CreateAsync(Employee employee);
        Task<bool> UpdateAsync(Employee employee);
        Task<bool> BranchExistsAndActiveAsync(int idBranch);
    }
}
