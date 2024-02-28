namespace backend.Controllers;
using backend.DTOs;
using backend.Servisi.Email;
[ApiController]
[Route("[controller]")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _email;

    public EmailController(IEmailService service)
    {
        _email = service;
    }

    [HttpPost("PosaljiEmail"), Authorize(Roles="admin")]
    public IActionResult PosaljiEmail(EmailDTO mejl){
        _email.SendEmail(mejl);
        return Ok();
    }
}