import os
import sys
from datetime import datetime, timezone, timedelta
from bson import ObjectId

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.services.db import get_db, persist_state
from backend.app.utils.auth_helper import hash_password

def seed_database():
    print("[*] Starting database seeding for Syntecxhub E-Commerce Store...")
    db = get_db()

    # Clear existing collections
    db.users.delete_many({})
    db.products.delete_many({})
    db.orders.delete_many({})

    # 1. Seed Users
    admin_pw = hash_password("Admin@123")
    customer_pw = hash_password("Customer@123")

    admin_user = {
        "_id": ObjectId("660000000000000000000001"),
        "name": "Store Admin",
        "email": "admin@shophub.com",
        "password": admin_pw,
        "role": "admin",
        "created_at": datetime.now(timezone.utc) - timedelta(days=60),
        "updated_at": datetime.now(timezone.utc)
    }

    admin_user_alt = {
        "_id": ObjectId("660000000000000000000004"),
        "name": "Admin User",
        "email": "admin@syntecxhub.com",
        "password": admin_pw,
        "role": "admin",
        "created_at": datetime.now(timezone.utc) - timedelta(days=60),
        "updated_at": datetime.now(timezone.utc)
    }

    customer_alex = {
        "_id": ObjectId("660000000000000000000002"),
        "name": "Alex Johnson",
        "email": "alex@example.com",
        "password": customer_pw,
        "role": "customer",
        "created_at": datetime.now(timezone.utc) - timedelta(days=45),
        "updated_at": datetime.now(timezone.utc)
    }

    customer_sarah = {
        "_id": ObjectId("660000000000000000000003"),
        "name": "Sarah Miller",
        "email": "sarah@example.com",
        "password": customer_pw,
        "role": "customer",
        "created_at": datetime.now(timezone.utc) - timedelta(days=30),
        "updated_at": datetime.now(timezone.utc)
    }

    db.users.insert_many([admin_user, admin_user_alt, customer_alex, customer_sarah])
    print(f"[+] Created 2 Admin and 2 Customer user accounts.")

    # 2. Seed Products
    products = [
        {
            "_id": ObjectId("660000000000000000000101"),
            "name": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
            "description": "Industry-leading noise canceling with two processors and 8 microphones. Up to 30-hour battery life with quick charging, crystal clear hands-free calling, and ultra-comfortable lightweight design.",
            "price": 349.99,
            "original_price": 399.99,
            "discount": 13,
            "category": "Electronics",
            "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
            "stock": 24,
            "rating": 4.8,
            "num_reviews": 128,
            "is_featured": True,
            "specs": {"Brand": "Sony", "Color": "Silver / Black", "Battery": "30 Hours", "Connectivity": "Bluetooth 5.2"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=20),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000102"),
            "name": "Apple MacBook Pro 14 M3 Chip (16GB RAM, 512GB SSD)",
            "description": "Featuring the groundbreaking M3 chip, stunning Liquid Retina XDR display, up to 22 hours of battery life, and pro-level connectivity with MagSafe 3 and Thunderbolt ports.",
            "price": 1599.00,
            "original_price": 1799.00,
            "discount": 11,
            "category": "Electronics",
            "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
            "stock": 12,
            "rating": 4.9,
            "num_reviews": 84,
            "is_featured": True,
            "specs": {"Processor": "Apple M3 8-Core", "RAM": "16GB Unified", "Storage": "512GB NVMe SSD", "Display": "14.2-inch XDR"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=18),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000103"),
            "name": "Logitech MX Master 3S Wireless Performance Mouse",
            "description": "Quiet clicks and 8,000 DPI track-on-glass sensor. MagSpeed electromagnetic scrolling delivers 1,000 lines per second speed and pixel-grade precision.",
            "price": 99.99,
            "original_price": 119.99,
            "discount": 17,
            "category": "Electronics",
            "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
            "stock": 42,
            "rating": 4.9,
            "num_reviews": 210,
            "is_featured": False,
            "specs": {"Sensor": "8000 DPI Darkfield", "Battery": "Up to 70 days", "Connectivity": "Bluetooth & Logi Bolt"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=15),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000104"),
            "name": "Dell UltraSharp 27-inch 4K UHD USB-C Hub Monitor",
            "description": "Experience vibrant color and detail across a 4K resolution screen with 98% DCI-P3 coverage and 90W power delivery through USB-C connectivity.",
            "price": 489.00,
            "original_price": 549.99,
            "discount": 11,
            "category": "Electronics",
            "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
            "stock": 14,
            "rating": 4.7,
            "num_reviews": 62,
            "is_featured": False,
            "specs": {"Resolution": "3840 x 2160 (4K)", "Panel": "IPS Black", "Ports": "USB-C, HDMI, DP"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=14),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000105"),
            "name": "Premium Minimalist Leather Chronograph Watch",
            "description": "Sleek sapphire crystal face paired with hand-stitched genuine Italian leather. Water resistant up to 50 meters with precision Japanese quartz movement.",
            "price": 149.99,
            "original_price": 199.99,
            "discount": 25,
            "category": "Fashion",
            "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
            "stock": 35,
            "rating": 4.8,
            "num_reviews": 95,
            "is_featured": True,
            "specs": {"Case": "40mm Stainless Steel", "Band": "Italian Leather", "Glass": "Sapphire Crystal"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=25),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000106"),
            "name": "Classic Tailored Wool Blend Overcoat",
            "description": "Timeless single-breasted silhouette made from premium insulating wool blend. Designed for effortless layering and sophisticated cold-weather style.",
            "price": 189.00,
            "original_price": 249.00,
            "discount": 24,
            "category": "Fashion",
            "image_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
            "stock": 18,
            "rating": 4.6,
            "num_reviews": 47,
            "is_featured": False,
            "specs": {"Material": "70% Wool, 30% Polyester", "Fit": "Tailored Regular", "Lining": "100% Silk-Touch Satin"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=12),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000107"),
            "name": "Full-Grain Italian Leather Weekend Duffle Bag",
            "description": "Spacious and durable weekender handcrafted from vegetable-tanned leather. Includes separate shoe compartment, brass hardware, and detachable shoulder strap.",
            "price": 219.00,
            "original_price": 280.00,
            "discount": 22,
            "category": "Fashion",
            "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
            "stock": 9,
            "rating": 4.9,
            "num_reviews": 73,
            "is_featured": True,
            "specs": {"Dimensions": "52 x 28 x 26 cm", "Capacity": "40 Liters", "Hardware": "Antique Brass"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=10),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000108"),
            "name": "De'Longhi Magnifica S Automatic Espresso Machine",
            "description": "Brew café-quality espresso and creamy lattes with a single touch. Integrated conical burr grinder with 13 grind settings and manual milk frother.",
            "price": 599.95,
            "original_price": 749.95,
            "discount": 20,
            "category": "Home & Kitchen",
            "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
            "stock": 7,
            "rating": 4.8,
            "num_reviews": 112,
            "is_featured": True,
            "specs": {"Pressure": "15 Bar", "Bean Container": "250g", "Water Tank": "1.8 Liters"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=30),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000109"),
            "name": "Ninja Air Fryer Pro 4-in-1 with 5-Qt Capacity",
            "description": "Air fry, roast, reheat, and dehydrate quick meals. Crispy results with up to 75% less fat than traditional frying methods.",
            "price": 119.99,
            "original_price": 149.99,
            "discount": 20,
            "category": "Home & Kitchen",
            "image_url": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
            "stock": 25,
            "rating": 4.7,
            "num_reviews": 164,
            "is_featured": False,
            "specs": {"Capacity": "5 Quarts", "Power": "1750 Watts", "Dishwasher Safe": "Yes"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=8),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000110"),
            "name": "Aromatherapy Ceramic Ultrasonic Diffuser",
            "description": "Handcrafted matte ceramic cover with ambient warm LED light. Ultra-quiet mist dispersion for soothing relaxation and restful sleep.",
            "price": 39.99,
            "original_price": 54.99,
            "discount": 27,
            "category": "Home & Kitchen",
            "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
            "stock": 55,
            "rating": 4.5,
            "num_reviews": 88,
            "is_featured": False,
            "specs": {"Tank Capacity": "200ml", "Coverage": "300 sq ft", "Timer": "Continuous / Intermittent"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=5),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000111"),
            "name": "Hyaluronic Acid & Vitamin C Brightening Serum Set",
            "description": "Clinical grade antioxidants and multi-molecular weight hyaluronic acid to intensely hydrate, even skin tone, and restore natural glow.",
            "price": 42.00,
            "original_price": 58.00,
            "discount": 28,
            "category": "Beauty & Wellness",
            "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
            "stock": 60,
            "rating": 4.7,
            "num_reviews": 140,
            "is_featured": True,
            "specs": {"Volume": "30ml x 2", "Skin Type": "All Skin Types", "Key Actives": "Vitamin C, HA, Ferulic"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=16),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000112"),
            "name": "Theragun Mini Ultra-Portable Percussive Massager",
            "description": "Pocket-sized deep muscle treatment. Compact yet powerful percussive therapy to melt away stress, knots, and post-workout soreness.",
            "price": 179.00,
            "original_price": 199.00,
            "discount": 10,
            "category": "Beauty & Wellness",
            "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
            "stock": 15,
            "rating": 4.8,
            "num_reviews": 79,
            "is_featured": False,
            "specs": {"Speeds": "3 Speeds (1750, 2100, 2400 PPM)", "Weight": "1.43 lbs", "Battery": "150 min"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=22),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000113"),
            "name": "Garmin Forerunner 265 GPS Running Smartwatch",
            "description": "Brilliant AMOLED touchscreen display with advanced training metrics, wrist-based running dynamics, sleep tracking, and up to 13 days of battery life.",
            "price": 449.99,
            "original_price": 499.99,
            "discount": 10,
            "category": "Audio & Wearables",
            "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
            "stock": 19,
            "rating": 4.8,
            "num_reviews": 65,
            "is_featured": True,
            "specs": {"Display": "1.3-inch AMOLED", "GPS": "Multi-band GNSS", "Water Rating": "5 ATM"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=11),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "_id": ObjectId("660000000000000000000114"),
            "name": "Bose SoundLink Flex Bluetooth Outdoor Speaker",
            "description": "Engineered for deep, immersive audio wherever adventure takes you. Waterproof, dustproof (IP67), with PositionIQ technology for optimal orientation sound.",
            "price": 129.00,
            "original_price": 149.00,
            "discount": 13,
            "category": "Audio & Wearables",
            "image_url": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
            "stock": 30,
            "rating": 4.7,
            "num_reviews": 118,
            "is_featured": False,
            "specs": {"Battery Life": "Up to 12 Hours", "Waterproof": "IP67 Rating", "Connectivity": "Bluetooth 4.2"},
            "created_at": datetime.now(timezone.utc) - timedelta(days=7),
            "updated_at": datetime.now(timezone.utc)
        }
    ]

    db.products.insert_many(products)
    print(f"[+] Created {len(products)} high-quality realistic products across 5 categories.")

    # 3. Seed Sample Orders
    order_1 = {
        "_id": ObjectId("660000000000000000000201"),
        "user_id": "660000000000000000000002",  # Alex Johnson
        "customer_name": "Alex Johnson",
        "customer_email": "alex@example.com",
        "items": [
            {
                "product_id": "660000000000000000000101",
                "name": "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
                "price": 349.99,
                "quantity": 1,
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                "category": "Electronics"
            },
            {
                "product_id": "660000000000000000000103",
                "name": "Logitech MX Master 3S Wireless Performance Mouse",
                "price": 99.99,
                "quantity": 1,
                "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
                "category": "Electronics"
            }
        ],
        "shipping_address": {
            "full_name": "Alex Johnson",
            "phone": "+1 (555) 234-5678",
            "address": "742 Evergreen Terrace",
            "city": "Springfield",
            "state": "OR",
            "postal_code": "97477",
            "country": "United States"
        },
        "payment_method": "Credit / Debit Card (Demo)",
        "payment_status": "Paid (Demo Simulation)",
        "subtotal": 449.98,
        "tax": 35.99,
        "shipping_fee": 0.0,
        "total_amount": 485.97,
        "order_status": "Delivered",
        "created_at": datetime.now(timezone.utc) - timedelta(days=12),
        "updated_at": datetime.now(timezone.utc) - timedelta(days=9)
    }

    order_2 = {
        "_id": ObjectId("660000000000000000000202"),
        "user_id": "660000000000000000000003",  # Sarah Miller
        "customer_name": "Sarah Miller",
        "customer_email": "sarah@example.com",
        "items": [
            {
                "product_id": "660000000000000000000105",
                "name": "Premium Minimalist Leather Chronograph Watch",
                "price": 149.99,
                "quantity": 1,
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
                "category": "Fashion"
            },
            {
                "product_id": "660000000000000000000111",
                "name": "Hyaluronic Acid & Vitamin C Brightening Serum Set",
                "price": 42.00,
                "quantity": 2,
                "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
                "category": "Beauty & Wellness"
            }
        ],
        "shipping_address": {
            "full_name": "Sarah Miller",
            "phone": "+1 (555) 876-5432",
            "address": "456 Market Street, Suite 900",
            "city": "San Francisco",
            "state": "CA",
            "postal_code": "94105",
            "country": "United States"
        },
        "payment_method": "Credit / Debit Card (Demo)",
        "payment_status": "Paid (Demo Simulation)",
        "subtotal": 233.99,
        "tax": 18.72,
        "shipping_fee": 0.0,
        "total_amount": 252.71,
        "order_status": "Processing",
        "created_at": datetime.now(timezone.utc) - timedelta(days=2),
        "updated_at": datetime.now(timezone.utc)
    }

    db.orders.insert_many([order_1, order_2])
    print("[+] Created 2 sample customer orders for Alex and Sarah.")

    persist_state()
    print("[SUCCESS] Database seeding completed successfully!")
    print("\nCredentials summary:")
    print("--------------------------------------------------")
    print("Admin:    admin@syntecxhub.com   | Admin@123")
    print("Customer: alex@example.com       | Customer@123")
    print("Customer: sarah@example.com      | Customer@123")
    print("--------------------------------------------------")

if __name__ == "__main__":
    seed_database()
