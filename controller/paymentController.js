let unirest = require("unirest");
let req = unirest(
  "GET",
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
)
  .headers({
    Authorization:
      "Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==",
  })
  .send()
  .end((res) => {
    if (res.error) throw new Error(res.error);
    console.log(res.raw_body);
  });
