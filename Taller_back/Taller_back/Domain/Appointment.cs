namespace Taller_back.Domain
{
    public class Appointment
    {
        public int IdAppointment { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; }
        public string Status { get; set; }
        public string Observations { get; set; }
        public int IdBranch { get; set; }
        public int? IdClient { get; set; }
        public Client? Client { get; set; }
        public bool ClientWasCreatedHere { get; set; }

        public string VehiclePlate { get; set; }
        public string VehicleBrand { get; set; }
        public bool IsActive { get; set; }


        public Branch Branch { get; set; }
        public ICollection<AppointmentService> AppointmentServices { get; set; }
    }
}
