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
const purchaseControllers = require("../controllers/purchase/purchaseControllers");
const salesControllers = require("../controllers/sales/salesControllers");
const returnControllers = require("../controllers/return/returnControllers");
const summaryController = require("../controllers/summary/summaryController");
const reportControllers = require("../controllers/report/reportControllers");

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
router.get("/brand-details/:_id", authenticateMiddleware, brandControllers.brandDetailsById);
router.put("/update-brand/:id", authenticateMiddleware, brandControllers.updateBrand);
router.get("/brand-list", authenticateMiddleware, brandControllers.brandList);
router.get("/brand-dropdown", authenticateMiddleware, brandControllers.brandDropDown);
router.delete("/delete-brand/:_id", authenticateMiddleware, brandControllers.deleteBrand);

// Category
router.post("/create-category", authenticateMiddleware, categoryControllers.createCategory);
router.get("/category-details/:_id", authenticateMiddleware, categoryControllers.categoryDetailsById);
router.put("/update-category/:id", authenticateMiddleware, categoryControllers.updateCategory);
router.get("/category-list", authenticateMiddleware, categoryControllers.categoryList);
router.get("/category-dropdown", authenticateMiddleware, categoryControllers.categoryDropDown);
router.delete("/delete-category/:_id", authenticateMiddleware, categoryControllers.deleteCategory);

// Supplier
router.post("/create-supplier", authenticateMiddleware, supplierControllers.createSupplier);
router.get("/supplier-details/:_id", authenticateMiddleware, supplierControllers.supplierDetailsById);
router.put("/update-supplier/:id", authenticateMiddleware, supplierControllers.updateSupplier);
router.get("/supplier-list", authenticateMiddleware, supplierControllers.supplierList);
router.get("/supplier-dropdown", authenticateMiddleware, supplierControllers.supplierDropDown);
router.delete("/delete-supplier/:_id", authenticateMiddleware, supplierControllers.deleteSupplier);

// Customer
router.post("/create-customer", authenticateMiddleware, customerControllers.createCustomer);
router.get("/customer-details/:_id", authenticateMiddleware, customerControllers.customerDetailsById);
router.put("/update-customer/:id", authenticateMiddleware, customerControllers.updateCustomer);
router.get("/customer-list", authenticateMiddleware, customerControllers.customerList);
router.get("/customer-dropdown", authenticateMiddleware, customerControllers.customerDropDown);
router.delete("/delete-customer/:_id", authenticateMiddleware, customerControllers.deleteCustomer);

// expense Type
router.post("/create-expenseType", authenticateMiddleware, expenseTypeControllers.createExpenseType);
router.get("/expenseType-details/:_id", authenticateMiddleware, expenseTypeControllers.expenseTypeDetailsById);
router.put("/update-expenseType/:id", authenticateMiddleware, expenseTypeControllers.updateExpenseType);
router.get("/expenseType-list", authenticateMiddleware, expenseTypeControllers.expenseTypeList);
router.get("/expenseType-dropdown", authenticateMiddleware, expenseTypeControllers.expenseTypeDropDown);
router.delete("/delete-expenseType/:_id", authenticateMiddleware, expenseTypeControllers.deleteExpenseType);

// expense
router.post("/create-expense", authenticateMiddleware, expenseControllers.createExpense);
router.get("/expense-details/:_id", authenticateMiddleware, expenseControllers.expenseDetailsById);
router.put("/update-expense/:id", authenticateMiddleware, expenseControllers.updateExpense);
router.get("/expense-list", authenticateMiddleware, expenseControllers.expenseList);
router.delete("/delete-expense/:_id", authenticateMiddleware, expenseControllers.deleteExpense);

// Product
router.post("/create-product", authenticateMiddleware, productControllers.createProduct);
router.get("/product-details/:_id", authenticateMiddleware, productControllers.productDetailsById);
router.put("/update-product/:id", authenticateMiddleware, productControllers.updateProduct);
router.get("/product-list", authenticateMiddleware, productControllers.ProductList);
router.get("/product-dropdown", authenticateMiddleware, productControllers.ProductDropDown);
router.delete("/delete-product/:_id", authenticateMiddleware, productControllers.deleteProduct);

// Purchase
router.post("/create-purchase", authenticateMiddleware, purchaseControllers.createPurchase);
router.get("/purchase-list", authenticateMiddleware, purchaseControllers.PurchaseList);
router.delete("/delete-purchase/:_id", authenticateMiddleware, purchaseControllers.deletePurchase);

// Sales
router.post("/create-sales", authenticateMiddleware, salesControllers.createSales);
router.get("/sales-list", authenticateMiddleware, salesControllers.salesList);
router.delete("/delete-sales/:_id", authenticateMiddleware, salesControllers.deleteSales);

// Return
router.post("/create-return", authenticateMiddleware, returnControllers.createReturn);
router.get("/return-list", authenticateMiddleware, returnControllers.returnList);
router.delete("/delete-return/:_id", authenticateMiddleware, returnControllers.deleteReturn);

// report
router.get("/expense-reportByDate", authenticateMiddleware, reportControllers.expenseReport);
router.get("/purchase-reportByDate", authenticateMiddleware, reportControllers.purchaseReport);
router.get("/sales-reportByDate", authenticateMiddleware, reportControllers.salesReport);
router.get("/return-reportByDate", authenticateMiddleware, reportControllers.returnReport);

// summary
router.get("/expense-summary", authenticateMiddleware, summaryController.expenseSummary);
router.get("/purchase-summary", authenticateMiddleware, summaryController.purchaseSummary);
router.get("/sales-summary", authenticateMiddleware, summaryController.salesSummary);
router.get("/return-summary", authenticateMiddleware, summaryController.returnSummary);

module.exports = router;
