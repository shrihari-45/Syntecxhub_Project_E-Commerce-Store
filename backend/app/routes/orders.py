from flask import Blueprint, request
from bson import ObjectId
from backend.app.services.db import get_db, persist_state
from backend.app.models.order import OrderModel
from backend.app.utils.serializers import serialize_doc, serialize_docs
from backend.app.utils.responses import success_response, error_response
from backend.app.middleware.auth import token_required

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

def _parse_id(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return id_str

@orders_bp.route("", methods=["POST"])
@token_required
def create_order(current_user):
    data = request.get_json() or {}
    items_input = data.get("items", [])
    shipping_address = data.get("shipping_address", {})
    payment_method = data.get("payment_method", "Credit / Debit Card (Demo)")
    promo_code = data.get("promo_code", "").strip().upper()

    if not items_input or not isinstance(items_input, list):
        return error_response("Order must contain at least one product item.", 400)

    # Validate shipping address
    address_errors = OrderModel.validate_shipping_address(shipping_address)
    if address_errors:
        return error_response("Invalid shipping address.", 400, address_errors)

    db = get_db()
    validated_items = []
    raw_subtotal = 0.0
    products_to_update = []

    # Verify each product and validate stock on the server
    for item in items_input:
        prod_id_str = item.get("product_id") or item.get("id")
        quantity = int(item.get("quantity", 1))

        if quantity <= 0:
            return error_response("Product quantity must be greater than zero.", 400)

        obj_id = _parse_id(prod_id_str)
        product = db.products.find_one({"$or": [{"_id": obj_id}, {"_id": prod_id_str}]})

        if not product:
            return error_response(f"Product with ID '{prod_id_str}' was not found.", 404)

        current_stock = int(product.get("stock", 0))
        if current_stock < quantity:
            return error_response(
                f"Insufficient stock for '{product.get('name')}'. Available: {current_stock}, Requested: {quantity}",
                400
            )

        unit_price = float(product.get("price", 0.0))
        item_total = unit_price * quantity
        raw_subtotal += item_total

        validated_items.append({
            "product_id": str(product["_id"]),
            "name": product.get("name"),
            "price": unit_price,
            "quantity": quantity,
            "image_url": product.get("image_url", ""),
            "category": product.get("category", "")
        })

        products_to_update.append((product["_id"], quantity))

    # Calculate promo discount
    discount_amount = 0.0
    if promo_code == "SYNTEC10":
        discount_amount = round(raw_subtotal * 0.10, 2)
    elif promo_code == "WELCOME20":
        discount_amount = round(raw_subtotal * 0.20, 2)

    subtotal_after_discount = max(0.0, raw_subtotal - discount_amount)
    
    # Calculate shipping fee: Free above $50, else $9.99
    shipping_fee = 0.0 if raw_subtotal >= 50.0 else 9.99
    
    # Calculate tax: 8%
    tax = round(subtotal_after_discount * 0.08, 2)
    total_amount = round(subtotal_after_discount + tax + shipping_fee, 2)

    payment_info = {
        "method": payment_method,
        "status": "Paid (Demo Simulation)",
        "promo_code": promo_code if discount_amount > 0 else None,
        "discount_amount": discount_amount
    }

    # Deduct stock for each item
    for prod_id, qty in products_to_update:
        db.products.update_one(
            {"_id": prod_id},
            {"$inc": {"stock": -qty}}
        )

    # Build order document
    order_doc = OrderModel.create_document(
        user_id=current_user["id"],
        customer_name=current_user.get("name", shipping_address.get("full_name")),
        customer_email=current_user.get("email"),
        items=validated_items,
        shipping_address=shipping_address,
        payment_info=payment_info,
        subtotal=raw_subtotal,
        tax=tax,
        shipping_fee=shipping_fee,
        total_amount=total_amount
    )

    result = db.orders.insert_one(order_doc)
    persist_state()

    created_order = serialize_doc(order_doc)
    created_order["id"] = str(result.inserted_id)

    return success_response({
        "order": created_order
    }, "Order placed successfully!", 201)

@orders_bp.route("/my-orders", methods=["GET"])
@token_required
def get_my_orders(current_user):
    db = get_db()
    cursor = db.orders.find({"user_id": str(current_user["id"])}).sort("created_at", -1)
    orders = list(cursor)
    return success_response({"orders": serialize_docs(orders)}, "My orders retrieved successfully")

@orders_bp.route("/<order_id>", methods=["GET"])
@token_required
def get_order_by_id(current_user, order_id):
    db = get_db()
    obj_id = _parse_id(order_id)
    order = db.orders.find_one({"$or": [{"_id": obj_id}, {"_id": order_id}]})

    if not order:
        return error_response("Order not found.", 404)

    # Authorization: Must be the user who placed order or an administrator
    if order.get("user_id") != str(current_user["id"]) and current_user.get("role") != "admin":
        return error_response("Forbidden: You are not authorized to view this order.", 403)

    return success_response({"order": serialize_doc(order)}, "Order retrieved successfully")
