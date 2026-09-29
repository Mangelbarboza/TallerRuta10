namespace Taller_back.Application.DTOs.Appointment
{
    public class AppointmentClientDTO
    {
        public int IdClient { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public bool WithAppointment { get; set; }
    }
}
