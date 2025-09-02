const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

// 🔹 ADD MAIN CATEGORY
const addCategory = async (req, res) => {
  try {
    const { name, description, isActive, sortOrder, metaTitle, metaDescription } = req.body;
    
    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Category image is required" });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "stylehub/categories"
    });

    // Create main category (level 0)
    const category = new Category({
      name,
      description,
      level: 0,
      parentCategory: null,
      image: result.secure_url,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
      metaTitle,
      metaDescription
    });

    await category.save();

    res.status(201).json({ 
      success: true, 
      message: "Main category added successfully", 
      category 
    });
  } catch (error) {
    console.error("Add category error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add category", 
      error: error.message 
    });
  }
};

// 🔹 ADD SUBCATEGORY
const addSubCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, isActive, sortOrder, metaTitle, metaDescription } = req.body;
    
    if (!parentCategory) {
      return res.status(400).json({ success: false, message: "Parent category is required for subcategory" });
    }

    // Check if parent category exists
    const parent = await Category.findById(parentCategory);
    if (!parent) {
      return res.status(400).json({ success: false, message: "Parent category not found" });
    }

    // Check maximum depth
    if (parent.level >= 2) {
      return res.status(400).json({ success: false, message: "Maximum category depth exceeded" });
    }

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "stylehub/categories"
      });
      imageUrl = result.secure_url;
    }

    // Create subcategory
    const subcategory = new Category({
      name,
      description,
      level: parent.level + 1,
      parentCategory: parentCategory,
      image: imageUrl,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
      metaTitle,
      metaDescription
    });

    await subcategory.save();

    // Update parent category's subcategories array
    await Category.findByIdAndUpdate(parentCategory, {
      $push: { subcategories: subcategory._id }
    });

    const populatedSubcategory = await Category.findById(subcategory._id)
      .populate('parentCategory', 'name slug');

    res.status(201).json({ 
      success: true, 
      message: "Subcategory added successfully", 
      category: populatedSubcategory 
    });
  } catch (error) {
    console.error("Add subcategory error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add subcategory", 
      error: error.message 
    });
  }
};

// 🔹 GET ALL CATEGORIES (Tree Structure for Admin)
const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const level = req.query.level;
    
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (level !== undefined) {
      query.level = parseInt(level);
    }

    // Get categories with pagination
    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .populate('subcategories', 'name slug image isActive')
      .sort({ level: 1, sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(query);

    // Get category statistics
    const stats = {
      totalCategories: await Category.countDocuments(),
      activeCategories: await Category.countDocuments({ isActive: true }),
      mainCategories: await Category.countDocuments({ level: 0 }),
      subcategories: await Category.countDocuments({ level: { $gt: 0 } })
    };

    res.json({
      success: true,
      data: categories,
      stats,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch categories", 
      error: error.message 
    });
  }
};

// 🔹 GET MAIN CATEGORIES ONLY (for dropdowns)
const getMainCategories = async (req, res) => {
  try {
    const mainCategories = await Category.find({ level: 0, isActive: true })
      .select('name slug image description sortOrder')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      categories: mainCategories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch main categories", 
      error: error.message 
    });
  }
};

// 🔹 GET SUBCATEGORIES BY PARENT
const getSubcategoriesByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    
    const subcategories = await Category.find({
      parentCategory: parentId,
      isActive: true
    })
    .select('name slug image description sortOrder')
    .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      subcategories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch subcategories", 
      error: error.message 
    });
  }
};

// 🔹 UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive, sortOrder, metaTitle, metaDescription } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const updateData = {
      name: name || category.name,
      description,
      isActive: isActive !== undefined ? isActive : category.isActive,
      sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder,
      metaTitle,
      metaDescription
    };

    // Handle image update
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "stylehub/categories"
      });
      updateData.image = result.secure_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name slug')
     .populate('subcategories', 'name slug image');

    res.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update category", 
      error: error.message 
    });
  }
};

// 🔹 DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete category with subcategories. Please delete subcategories first." 
      });
    }

    // Remove from parent category's subcategories array
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $pull: { subcategories: category._id }
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete category", 
      error: error.message 
    });
  }
};

// 🔹 TOGGLE CATEGORY STATUS
const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to toggle category status", 
      error: error.message 
    });
  }
};

// 🔹 GET CATEGORY STATS FOR DASHBOARD
const getCategoryStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });
    const mainCategories = await Category.countDocuments({ level: 0 });
    const subcategories = await Category.countDocuments({ level: { $gt: 0 } });

    res.json({
      success: true,
      stats: {
        total: totalCategories,
        active: activeCategories,
        main: mainCategories,
        subcategories: subcategories
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to get category stats", 
      error: error.message 
    });
  }
};

module.exports = {
  addCategory,
  addSubCategory,
  getCategories,
  getMainCategories,
  getSubcategoriesByParent,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getCategoryStats
};