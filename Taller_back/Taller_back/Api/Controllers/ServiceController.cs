using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taller_back.Application.DTOs.ServiceDTOs;
using Taller_back.Application.Interface;
using Taller_back.Application.Services;
using Taller_back.Domain;

namespace Taller_back.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _serviceService;
        private readonly IBranchServiceService _branchServiceService;

        public ServiceController(
            IServiceService serviceService,
            IBranchServiceService branchServiceService)
        {
            _serviceService = serviceService;
            _branchServiceService = branchServiceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var services = await _serviceService.GetAllAsync();
            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var service = await _serviceService.GetByIdAsync(id);
            if (service == null) return NotFound("Service no encontrado");

            return Ok(service);
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateServiceDTO dto)
        {
            await _serviceService.CreateAsync(dto);
            return Ok("Service creado correctamente");
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateServiceDTO dto)
        {
            var updated = await _serviceService.UpdateAsync(id, dto);
            if (!updated) return NotFound("Service no encontrado");

            return Ok("Service actualizado correctamente");
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _serviceService.DeleteAsync(id);
            if (!deleted) return NotFound("Service no encontrado");

            return Ok("Service eliminado correctamente");
        }

        [HttpGet("{id}/branches")]
        public async Task<IActionResult> GetBranchesByService(int id)
        {
            var branches = await _branchServiceService.GetBranchesByServiceAsync(id);
            return Ok(branches);
        }
    }

}
