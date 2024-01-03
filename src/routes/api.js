const express = require("express");
const userControllers = require("../controllers/user/userControllers");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");
const brandControllers = require("../controllers/brand/brandControllers");
const categoryControllers = require("../controllers/category/categoryControllers");
const supplierControllers = require("../controllers/supplier/supplierControllers");
const customerControllers = require("../controllers/customer/customerControllers");
const expenseTypeControllers = require("../controllers/expense/expenseTypeControllers");
const expenseControllers = require("../controllers/expense/expenseControllers");
const productControllers = require("../controllers/product/productControllers");

const router = express.Router();

// health checking
router.get("/health", (req, res) => {
  res.status(200).json({ message: "ok" });
});

// User Profile
router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/profile-details", authenticateMiddleware, userControllers.ProfileDetails);
router.patch("/profile-update", authenticateMiddleware, userControllers.ProfileUpdate);
router.patch("/change-password", authenticateMiddleware, userControllers.changePassword);
router.get("/send-otp/:email", userControllers.sendOTP);
router.get("/verify-otp/:email/:otp", userControllers.verifyOTP);
router.post("/recovery-password", userControllers.recoveryPassword);

// Brands
router.post("/create-brand", authenticateMiddleware, brandControllers.createBrand);
router.put("/update-brand/:id", authenticateMiddleware, brandControllers.updateBrand);
router.get("/brand-list", authenticateMiddleware, brandControllers.brandList);
router.get("/brand-dropdown", authenticateMiddleware, brandControllers.brandDropDown);

// Category
router.post("/create-category", authenticateMiddleware, categoryControllers.createCategory);
router.put("/update-category/:id", authenticateMiddleware, categoryControllers.updateCategory);
router.get("/category-list", authenticateMiddleware, categoryControllers.categoryList);
router.get("/category-dropdown", authenticateMiddleware, categoryControllers.categoryDropDown);

// Supplier
router.post("/create-supplier", authenticateMiddleware, supplierControllers.createSupplier);
router.put("/update-supplier/:id", authenticateMiddleware, supplierControllers.updateSupplier);
router.get("/supplier-list", authenticateMiddleware, supplierControllers.supplierList);
router.get("/supplier-dropdown", authenticateMiddleware, supplierControllers.supplierDropDown);

// Customer
router.post("/create-customer", authenticateMiddleware, customerControllers.createCustomer);
router.put("/update-customer/:id", authenticateMiddleware, customerControllers.updateCustomer);
router.get("/customer-list", authenticateMiddleware, customerControllers.customerList);
router.get("/customer-dropdown", authenticateMiddleware, customerControllers.customerDropDown);

// expense Type
router.post("/create-expenseType", authenticateMiddleware, expenseTypeControllers.createExpenseType);
router.put("/update-expenseType/:id", authenticateMiddleware, expenseTypeControllers.updateExpenseType);
router.get("/expenseType-list", authenticateMiddleware, expenseTypeControllers.expenseTypeList);
router.get("/expenseType-dropdown", authenticateMiddleware, expenseTypeControllers.expenseTypeDropDown);

// expense
router.post("/create-expense", authenticateMiddleware, expenseControllers.createExpense);
router.put("/update-expense/:id", authenticateMiddleware, expenseControllers.updateExpense);
router.get("/expense-list", authenticateMiddleware, expenseControllers.expenseList);

// Product
router.post("/create-product", authenticateMiddleware, productControllers.createProduct);
router.put("/update-product/:id", authenticateMiddleware, productControllers.updateProduct);
router.get("/product-list", authenticateMiddleware, productControllers.ProductList);
router.get("/product-dropdown", authenticateMiddleware, productControllers.ProductDropDown);

module.exports = router;
