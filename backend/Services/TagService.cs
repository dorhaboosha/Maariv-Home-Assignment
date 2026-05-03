using MaarivMiniApp.Api.Models;
using Microsoft.Extensions.Configuration;

namespace MaarivMiniApp.Api.Services;

public class TagService
{
    private readonly FileDataReader _fileDataReader;
    private readonly string _fileName;

    public TagService(FileDataReader fileDataReader, IConfiguration config)
    {
        _fileDataReader = fileDataReader;
        _fileName = config["DataFiles:Tags"];
    }

    public List<Tag> GetAllTags()
    {
        return _fileDataReader.ReadAndDeserialize<Tag>(_fileName);
    }

    public Tag? GetTagById(int id)
    {
        return GetAllTags().FirstOrDefault(t => t.TagId == id);
    }
}
