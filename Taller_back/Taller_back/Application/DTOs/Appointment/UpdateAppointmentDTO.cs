namespace Taller_back.Application.DTOs.Appointment
{
    public class UpdateAppointmentDTO
    {
        public DateTime? Date { get; set; }
        public string? Time { get; set; }
        public string? Status { get; set; }
        public string? Observations { get; set; }
        public int? IdBranch { get; set; }
        public string? VehiclePlate { get; set; }
        public string? VehicleBrand { get; set; }
        public List<int>? ServiceIds { get; set; }
    }
}