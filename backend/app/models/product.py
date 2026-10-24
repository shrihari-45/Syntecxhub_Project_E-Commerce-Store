from datetime import datetime, timezone

class ProductModel:
    @staticmethod
    def validate_product(data):
        errors = {}
        name = data.get("name", "").strip()
        price = data.get("price")
        category = data.get("category", "").strip()
        stock = data.get("stock")

        if not name or len(name) < 2:
            errors["name"] = "Product name must be at least 2 characters."
        
        try:
            p = float(price)
            if p < 0:
                errors["price"] = "Price cannot be negative."
        except (ValueError, TypeError):
            errors["price"] = "Valid numerical price is required."

        if not category:
            errors["category"] = "Category is required."

        try:
            s = int(stock)
            if s < 0:
                errors["stock"] = "Stock cannot be negative."
        except (ValueError, TypeError):
            errors["stock"] = "Valid integer stock quantity is required."

        return errors

    @staticmethod
    def create_document(data):
        price = float(data.get("price", 0.0))
        original_price = float(data.get("original_price", price))
        discount = int(data.get("discount", 0))
        if original_price > price and discount == 0:
            discount = int(round(((original_price - price) / original_price) * 100))

        return {
            "name": data.get("name", "").strip(),
            "description": data.get("description", "").strip(),
            "price": price,
            "original_price": original_price,
            "discount": discount,
            "category": data.get("category", "General").strip(),
            "image_url": data.get("image_url", "").strip(),
            "stock": int(data.get("stock", 0)),
            "rating": float(data.get("rating", 4.5)),
            "num_reviews": int(data.get("num_reviews", 0)),
            "is_featured": bool(data.get("is_featured", False)),
            "specs": data.get("specs", {}),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
