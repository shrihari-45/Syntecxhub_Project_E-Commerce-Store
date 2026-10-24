from datetime import datetime, timezone

ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

class OrderModel:
    @staticmethod
    def validate_shipping_address(address):
        errors = {}
        if not address or not isinstance(address, dict):
            return {"address": "Shipping address is required."}

        full_name = address.get("full_name", "").strip()
        street = address.get("address", "").strip()
        city = address.get("city", "").strip()
        state = address.get("state", "").strip()
        postal_code = address.get("postal_code", "").strip()
        country = address.get("country", "").strip()
        phone = address.get("phone", "").strip()

        if not full_name:
            errors["full_name"] = "Full recipient name is required."
        if not street:
            errors["address"] = "Street address is required."
        if not city:
            errors["city"] = "City is required."
        if not state:
            errors["state"] = "State/Province is required."
        if not postal_code:
            errors["postal_code"] = "Postal code is required."
        if not country:
            errors["country"] = "Country is required."
        if not phone:
            errors["phone"] = "Contact phone number is required."

        return errors

    @staticmethod
    def create_document(user_id, customer_name, customer_email, items, shipping_address, payment_info, subtotal, tax, shipping_fee, total_amount):
        return {
            "user_id": str(user_id),
            "customer_name": customer_name,
            "customer_email": customer_email,
            "items": items,
            "shipping_address": shipping_address,
            "payment_method": payment_info.get("method", "Card (Demo)"),
            "payment_status": payment_info.get("status", "Paid (Demo Simulation)"),
            "subtotal": round(subtotal, 2),
            "tax": round(tax, 2),
            "shipping_fee": round(shipping_fee, 2),
            "total_amount": round(total_amount, 2),
            "order_status": "Processing",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
