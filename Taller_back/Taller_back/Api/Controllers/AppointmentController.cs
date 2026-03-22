using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taller_back.Application.DTOs.Appointment;
using Taller_back.Application.Interface;

namespace Taller_back.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _appointmentService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _appointmentService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAppointmentDTO dto)
        {
            try
            {
                var created = await _appointmentService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.IdAppointment }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno: " + ex.Message);
            }
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> Update(int id, UpdateAppointmentDTO dto)
        {
            var existing = await _appointmentService.GetByIdAsync(id);

            if (existing == null)
                return NotFound();

            await _appointmentService.UpdateAsync(id, dto);

            return NoContent();
        }




        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _appointmentService.DeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}