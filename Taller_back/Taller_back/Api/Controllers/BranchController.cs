using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Taller_back.Application.DTOs.Branch;
using Taller_back.Application.Interface;
using Taller_back.Application.Services;

namespace Taller_back.Api.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : ControllerBase
    {
        private readonly IBranchService _branchService;
        private readonly IBranchServiceService _branchServiceService;

        public BranchController(IBranchService branchService, IBranchServiceService branchServiceService)
        {
            _branchService = branchService;
            _branchServiceService = branchServiceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
            var branches = await _branchService.GetAllAsync();
            return Ok(branches);
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateBranch([FromForm] CreateBranchDTO dto)
        {
            await _branchService.CreateAsync(dto);
            return Ok("Sucursal creada correctamente");
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBranch(int id, [FromForm] UpdateBranchDTO dto) { 
            await _branchService.UpdateAsync(id, dto);
            return Ok("Sucursal actualizada correctamente");
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBranch(int id)
        {
            await _branchService.DeleteAsync(id);
            return Ok("Sucursal eliminada");
        }
        [Authorize]
        [HttpPost("{branchId}/services/{serviceId}")]
        public async Task<IActionResult> AddService(int branchId, int serviceId)
        {
            await _branchServiceService.AddServiceToBranch(branchId, serviceId);
            return Ok("Servicio asignado a la sucursal");
        }
        [Authorize]
        [HttpDelete("{branchId}/services/{serviceId}")]
        public async Task<IActionResult> RemoveService(int branchId, int serviceId)
        {
            await _branchServiceService.DeleteServiceFromBranch(branchId, serviceId);
            
            return Ok("Servicio eliminado de la sucursal");
        }
        [Authorize]
        [HttpGet("{idBranch}/services")]
        public async Task<IActionResult> GetServicesByBranch(int idBranch)
        {
            var services = await _branchServiceService.GetServicesByBranchAsync(idBranch);
            return Ok(services);
        }
    }
}
