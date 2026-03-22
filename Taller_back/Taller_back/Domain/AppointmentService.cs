namespace Taller_back.Domain
{
    public class AppointmentService
    {
        public int IdAppointment { get; set; }
        public int IdService { get; set; }

        public Appointment Appointment { get; set; }
        public Service Service { get; set; }
    }
}
