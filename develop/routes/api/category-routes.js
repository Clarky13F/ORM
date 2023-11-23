const router = require("express").Router();
const { Category, Product } = require("../../models");
const { sync } = require("../../models/Product");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoriesWithProducts = await Category.findAll({
      include: Product,
    });

    res.json(categoriesWithProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  const categoryId = req.params.id;

  try {
    const category = await Category.findByPk(categoryId, {
      include: Product,
    });

    if (!category) {
      return res.status(404).json("Category not found.");
    }

    res.json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json("Category name is required.");
    }

    const newCategory = await Category.create({
      category_name,
    });

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryId = req.params.id;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json("Category name is required.");
    }

    const categoryToUpdate = await Category.findByPk(categoryId);

    if (!categoryToUpdate) {
      return res.status(404).json("Category not found.");
    }

    await categoryToUpdate.update({
      category_name,
    });

    res.json(categoryToUpdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryId = req.params.id;
    const categoryToDelete = await Category.destroy({
      where: {
        id: categoryId,
      },
    });

    if (!categoryToDelete) {
      res.status(404).json("Category not found.");
      return;
    }

    res.status(200).json(categoryToDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
