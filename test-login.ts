import "dotenv/config";

async function testSignIn() {
  console.log("Testing sign-in API endpoints...");
  
  // 1. Get CSRF Token
  const csrfRes = await fetch("http://localhost:3000/api/auth/csrf");
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  
  const cookies = csrfRes.headers.get("set-cookie") || "";
  console.log("Got CSRF Token:", csrfToken);
  
  // 2. Post Credentials
  const body = new URLSearchParams({
    email: "byronkimani@gmail.com",
    password: "password123",
    csrfToken: csrfToken,
    json: "true"
  });

  const res = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookies
    },
    body: body.toString()
  });

  const text = await res.text();
  console.log("Response Status:", res.status);
  console.log("Response URL:", res.url);
  try {
    console.log("Response Data:", JSON.parse(text));
  } catch(e) {
    console.log("Response Text:", text);
  }
}

testSignIn().catch(console.error);
