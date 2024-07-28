using Microsoft.AspNetCore.Mvc;

namespace Login.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
       

        [HttpPost(Name = "Login")]
        public bool Login([FromBody] LoginResultDto request)
        {
            return CryptoHelper.DecryptString(request.UserName) == "admin" && CryptoHelper.DecryptString(request.Password) == "password";
        }
        [Route("Encrypt")]
        [HttpGet]
        public string Encrypt(string request)
        {
            return CryptoHelper.EncryptString(request);
        }
        [Route("Decrypt")]
        [HttpGet]
        public string Decrypt(string request)
        {
            return CryptoHelper.DecryptString(request);
        }
    }
}
