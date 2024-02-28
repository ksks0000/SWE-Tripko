namespace backend.Servisi.Email;
using backend.DTOs;
public interface IEmailService{

    void SendEmail(EmailDTO request);

}