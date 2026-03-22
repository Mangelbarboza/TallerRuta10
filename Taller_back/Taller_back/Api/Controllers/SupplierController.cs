using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taller_back.Application.DTOs.Branch;
using Taller_back.Application.DTOs.Supplier;
using Taller_back.Application.Interface;

namespace Taller_back.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var suppliers = await _supplierService.GetAllAsync();
            return Ok(suppliers);
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateBranch(CreateSupplierDTO dto)
        {
            await _supplierService.CreateAsync(dto);
            return Ok("Proveedor creado correctamente");
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id) {
            await _supplierService.DeleteAsync(id);
            return Ok("Proveedor eliminado correctamente");
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupplier(int id, UpdateSupplierDTO dto) { 
            await _supplierService.UpdateAsync(id, dto);
            return Ok("Proveedor actualizado correctamente");
        }

    }
}
