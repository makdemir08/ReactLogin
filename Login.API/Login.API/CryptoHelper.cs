using System.Security.Cryptography;
using System.Text;

namespace Login.API
{
    public class CryptoHelper
    {
        private static readonly string SecretKey = "YourSecretKey123"; // 16, 24 veya 32 karakter uzunluğunda olmalı

        public static string EncryptString(string plainText)
        {
            using (var aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(SecretKey);
                aes.GenerateIV(); // Her şifreleme için yeni bir IV oluştur

                var iv = aes.IV;
                var encryptor = aes.CreateEncryptor(aes.Key, iv);

                using (var ms = new MemoryStream())
                {
                    ms.Write(iv, 0, iv.Length); // IV'yi başlangıçta kaydet
                    using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    {
                        using (var sw = new StreamWriter(cs))
                        {
                            sw.Write(plainText);
                        }
                    }

                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }

        public static string DecryptString(string cipherText)
        {
            try
            {
                // Eğer veri Base64 formatında değilse, bu bir FormatException hatasına yol açar
                var buffer = Convert.FromBase64String(cipherText);

                using (var aes = Aes.Create())
                {
                    aes.Key = Encoding.UTF8.GetBytes(SecretKey);

                    using (var ms = new MemoryStream(buffer))
                    {
                        var iv = new byte[16];
                        ms.Read(iv, 0, iv.Length); // IV'yi başlangıçta oku

                        var decryptor = aes.CreateDecryptor(aes.Key, iv);
                        using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                        {
                            using (var sr = new StreamReader(cs))
                            {
                                return sr.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch (FormatException)
            {
                // Base64 formatında geçersiz karakterler varsa, bu bir FormatException hatasına yol açar
                return "Invalid Base64 format.";
            }
            catch (CryptographicException)
            {
                // Şifre çözme sırasında geçersiz bir şifreleme varsa, bu bir CryptographicException hatasına yol açar
                return "Invalid encryption data.";
            }
            catch (Exception ex)
            {
                // Diğer hataları yakala
                return $"Error: {ex.Message}";
            }
        }
   
    }
}
