namespace Taller_back.Application.DTOs.Appointment
{
    public class AppointmentDTO
    {
        public int IdAppointment { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; }
        public string Status { get; set; }
        public string Observations { get; set; }
        public int IdBranch { get; set; }
        public int? IdClient { get; set; }
        public string VehiclePlate { get; set; }
        public string VehicleBrand { get; set; }
        public bool IsActive { get; set; }
        public AppointmentClientDTO? Client { get; set; }


        public AppointmentBranchDTO Branch { get; set; }
        public List<AppointmentServiceItemDTO> Services { get; set; }
    }
}
