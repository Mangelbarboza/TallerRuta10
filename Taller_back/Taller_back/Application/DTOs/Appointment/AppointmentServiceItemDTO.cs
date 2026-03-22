namespace Taller_back.Application.DTOs.Appointment
{
    public class AppointmentServiceItemDTO
    {
        public int IdService { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public bool IsActive { get; set; }
    }
}
