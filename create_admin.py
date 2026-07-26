import json
import urllib.request

BASE_URL = "http://127.0.0.1:8080/api"

def make_request(endpoint, method="POST", data=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read().decode("utf-8"))
    except Exception as e:
        print(f"Error: {e}")
        return None

admin_user = {
    "fullName": "Hirotix Root Admin",
    "email": "admin@hirotix.com",
    "password": "admin123",
    "role": "ADMIN"
}


print("Checking if admin already exists...")
login_res = make_request("/auth/login", data={"email": admin_user["email"], "password": admin_user["password"]})

if login_res:
    print("Admin already exists! You can use these credentials.")
else:
    print("Creating new admin account...")
    reg_res = make_request("/auth/register", data=admin_user)
    if reg_res:
        print("Success! Admin account created.")
    else:
        print("Failed to create admin. Make sure the backend is running.")

print("\n------------------------------------")
print(f"ADMIN LOGIN: {admin_user['email']}")
print(f"ADMIN PASS:  {admin_user['password']}")
print("------------------------------------")
