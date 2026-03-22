using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taller_back.Application.DTOs.Client;
using Taller_back.Application.Interface;

namespace Taller_back.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _clientService.GetAllAsync());
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateClientDTO dto)
        {
            try
            {
                await _clientService.CreateAsync(dto);
                return Ok("Cliente creado correctamente");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, UpdateClientDTO dto)
        {
            try
            {
                await _clientService.UpdateAsync(id, dto);
                return Ok("Cliente actualizado correctamente");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _clientService.DeleteAsync(id);
            return Ok("Cliente eliminado correctamente");
        }
    }
}
