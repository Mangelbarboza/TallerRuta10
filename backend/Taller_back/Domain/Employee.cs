namespace Taller_back.Domain
{
    public class Employee
    {
        public int IdEmployee { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public int IdBranch { get; set; }
        public Branch Branch { get; set; }
        public bool IsActive { get; set; }
    }
}
