using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taller_back.Application.DTOs.Product;
using Taller_back.Application.Interface;

namespace Taller_back.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm]CreateProductDTO dto)
        {
            await _productService.CreateAsync(dto);
            return Ok("Producto creado correctamente");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateProductDTO dto)
        {
            if (id != dto.IdProduct)
                return BadRequest("El ID no coincide");

            var updated = await _productService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound("Producto no encontrado");

            return NoContent(); 
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _productService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Producto no encontrado");

            return Ok("Producto eliminado correctamente");
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }


    }
}
