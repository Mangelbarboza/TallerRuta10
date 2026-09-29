namespace Taller_back.Application.DTOs.Appointment
{
    public class CreateAppointmentDTO
    {
        public DateTime Date { get; set; }
        public string Time { get; set; }
        public string Status { get; set; }
        public string Observations { get; set; }
        public int IdBranch { get; set; }

        public int? IdClient { get; set; }
        public CreateAppointmentClientDTO? NewClient { get; set; }

        public string VehiclePlate { get; set; }
        public string VehicleBrand { get; set; }

        public List<int> ServiceIds { get; set; }
    }
}
