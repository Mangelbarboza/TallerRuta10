namespace Taller_back.Application.Interface
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string subDirectory);
        Task<bool> DeleteFileAsync(string filePath);

    }
}
