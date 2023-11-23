const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");
const { afterSync } = require("../../models/Product");

// The `/api/tags` endpoint
async function getAllTags() {
  try {
    const tags = await Tag.findAll();
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}
router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagsWithProducts = await Tag.findAll({
      include: [{ model: Product, through: "ProductTag" }],
    });

    res.json(tagsWithProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagId = req.params.id;

    const tagWithProducts = await Tag.findByPk(tagId, {
      include: [{ model: Product, through: "ProductTag" }],
    });

    if (!tagWithProducts) {
      return res.status(404).json("Tag not found.");
    }

    res.json(tagWithProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const { tag_name } = req.body;

    if (!tag_name) {
      return res.status(400).json("Tag name is required.");
    }

    const newTag = await Tag.create({
      tag_name,
    });

    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagId = req.params.id;
    const { tag_name } = req.body;

    if (!tag_name) {
      return res.status(400).json("Tag name is required.");
    }

    const tagToUpdate = await Tag.findByPk(tagId);

    if (!tagToUpdate) {
      return res.status(404).json("Tag not found.");
    }

    await tagToUpdate.update({
      tag_name,
    });

    res.json(tagToUpdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagId = req.params.id;

    const deletedTagCount = await Tag.destroy({
      where: { id: tagId },
    });

    if (deletedTagCount === 0) {
      return res.status(404).json("Tag not found.");
    }

    res.status(200).json(deletedTagCount);
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
