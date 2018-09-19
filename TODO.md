POST https://api.ebay.com/identity/v1/oauth2/token HTTP/1.1
Host: api.ebay.com
Connection: keep-alive
Content-Length: 170
Accept: application/json, text/plain, */*
Origin: http://evil.com/
Authorization: Basic U3RvY2tpZS1TdG9ja2llLVBSRC04MDkwMmViZjktNDY0YjU5Yjc6UFJELTA5MDJlYmY5YjY2My01YTNmLTQ0OTUtYmM3MC04YjI3
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36
Content-Type: application/x-www-form-urlencoded
Referer: https://localhost:4200/
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9

grant_type=authorization_code&code=v^1.1#i^1#p^3#f^0#I^3#r^1#t^Ul41XzQ6QkJDNDU4OTBDNDAzMjdEMTY3NzY2RkUyODEyMTQ4QkZfMF8xI0VeMjYw

----------------------

POST https://api.ebay.com/identity/v1/oauth2/token HTTP/1.1
Host: api.ebay.com
Connection: keep-alive
Content-Length: 153
Content-Type: application/x-www-form-urlencoded
Authorization: Basic U3RvY2tpZS1TdG9ja2llLVBSRC04MDkwMmViZjktNDY0YjU5Yjc6UFJELTA5MDJlYmY5YjY2My01YTNmLTQ0OTUtYmM3MC04YjI3
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ebay-playground-rebuild/0.0.0 Chrome/61.0.3163.100 Electron/2.0.9 Safari/537.36
Accept-Encoding: gzip, deflate
Accept-Language: en-US

grant_type=authorization_code&code=v%5E1.1%23i%5E1%23I%5E3%23f%5E0%23p%5E3%23r%5E1%23t%5EUl41XzE6NTA1Q0IzOTEzOUQyOENFNzg1Nzg3NTg0MDJENzg4OUJfMF8xI0VeMjYw