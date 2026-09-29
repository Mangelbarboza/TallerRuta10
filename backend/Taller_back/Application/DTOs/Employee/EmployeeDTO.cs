namespace Taller_back.Application.DTOs.Employee
{
    public class EmployeeDTO
    {
        public int IdEmployee { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public int IdBranch { get; set; }
        public bool IsActive { get; set; }
        public EmployeeBranchDTO Branch { get; set; }
    }
}
