using Taller_back.Application.DTOs.Branch;
using Taller_back.Application.DTOs.ServiceDTOs;

namespace Taller_back.Application.Interface
{
    public interface IBranchServiceService
    {
        Task AddServiceToBranch(int idBranch, int idService);
        Task DeleteServiceFromBranch(int idBranch, int idService);
        Task<List<ServiceDTO>> GetServicesByBranchAsync(int branchId);

        Task<List<BranchDTO>> GetBranchesByServiceAsync(int serviceId);
    }
}
