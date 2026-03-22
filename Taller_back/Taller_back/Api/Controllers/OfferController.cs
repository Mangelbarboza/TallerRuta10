using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taller_back.Application.DTOs.Offer;
using Taller_back.Application.DTOs.OfferDTOs;
using Taller_back.Application.Services;

namespace Taller_back.Api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class OfferController : ControllerBase
    {
        private readonly OfferService _offerService;

        public OfferController(OfferService offerService)
        {
            _offerService = offerService;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOfferDto dto)
        {
            var offer = await _offerService.CreateAsync(dto);
            return Ok(offer);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var offers = await _offerService.getAllAsync();
            return Ok(offers);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var offers = await _offerService.getActiveAsync();
            return Ok(offers);
        }
        [Authorize]
        [HttpPut("{idOffer}")]
        public async Task<IActionResult> Update(int idOffer, [FromBody] UpdateOfferDto dto)
        {
            try
            {
                var offer = await _offerService.UpdateAsync(idOffer, dto);
                return Ok(offer);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpDelete("{idOffer}")]
        public async Task<IActionResult> Delete(int idOffer)
        {
            try
            {
                await _offerService.DeleteAsync(idOffer);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
