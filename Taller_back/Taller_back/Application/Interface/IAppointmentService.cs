using Taller_back.Application.DTOs.Appointment;

namespace Taller_back.Application.Interface
{
    public interface IAppointmentService
    {
        Task<List<AppointmentDTO>> GetAllAsync();
        Task<AppointmentDTO?> GetByIdAsync(int id);
        Task<AppointmentDTO> CreateAsync(CreateAppointmentDTO dto);
        Task<bool> UpdateAsync(int id, UpdateAppointmentDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
