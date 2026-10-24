import urllib.request
import urllib.parse
import json

BASE = "http://127.0.0.1:5000/api"

def make_req(endpoint, method="GET", data=None, token=None):
    url = f"{BASE}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    encoded_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as err:
        return err.code, json.loads(err.read().decode())

def run_all_tests():
    print("[*] Starting Syntecxhub API Integration Verification...")

    # 1. Health Check
    status, res = make_req("/health")
    assert status == 200 and res["status"] == "healthy"
    print("[TEST 1/7 PASS] Backend health verified: 200 OK.")

    # 2. Products Catalog & Filters
    status, res = make_req("/products?category=Electronics&limit=4")
    assert status == 200 and len(res["data"]["products"]) > 0
    first_prod = res["data"]["products"][0]
    print(f"[TEST 2/7 PASS] Catalog products retrieved: {first_prod['name'][:40]}... (${first_prod['price']})")

    # 3. Customer Authentication
    status, alex_login = make_req("/auth/login", method="POST", data={"email": "alex@example.com", "password": "Customer@123"})
    assert status == 200 and alex_login["success"] is True
    alex_token = alex_login["data"]["token"]
    print(f"[TEST 3/7 PASS] Customer login verified (Token issued, User: {alex_login['data']['user']['name']}).")

    # 4. Admin Authentication
    status, admin_login = make_req("/auth/login", method="POST", data={"email": "admin@syntecxhub.com", "password": "Admin@123"})
    assert status == 200 and admin_login["data"]["user"]["role"] == "admin"
    admin_token = admin_login["data"]["token"]
    print(f"[TEST 4/7 PASS] Admin login verified (Role: {admin_login['data']['user']['role']}).")

    # 5. Security & Authorization Boundary
    unauth_status, _ = make_req("/admin/dashboard", token=alex_token)
    assert unauth_status == 403
    print("[TEST 5/7 PASS] Role authorization verified: customer received 403 Forbidden on admin endpoint.")

    # 6. Order Placement with stock verification & promo code
    order_payload = {
        "items": [{"product_id": first_prod["id"], "quantity": 1}],
        "shipping_address": {
            "full_name": "Alex Johnson",
            "phone": "+1 555-234-5678",
            "address": "742 Evergreen Terrace",
            "city": "Springfield",
            "state": "OR",
            "postal_code": "97477",
            "country": "United States"
        },
        "payment_method": "Credit / Debit Card (Demo)",
        "promo_code": "SYNTEC10"
    }
    status, order_res = make_req("/orders", method="POST", data=order_payload, token=alex_token)
    assert status == 201 and order_res["success"] is True
    new_order = order_res["data"]["order"]
    print(f"[TEST 6/7 PASS] Customer order created in DB! ID: {new_order['id']}, Server Total: ${new_order['total_amount']}")

    # 7. Admin Order Fulfillment Status Update
    status, update_res = make_req(f"/admin/orders/{new_order['id']}/status", method="PUT", data={"status": "Shipped"}, token=admin_token)
    assert status == 200 and update_res["data"]["order"]["order_status"] == "Shipped"
    print(f"[TEST 7/7 PASS] Admin updated order status in DB to: {update_res['data']['order']['order_status']}")

    print("\n>>> ALL 7 AUTOMATED INTEGRATION TESTS COMPLETED WITH 100% SUCCESS! <<<")

if __name__ == "__main__":
    run_all_tests()
