const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Get notifications for a user (or admin if userId=null)
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ userId: req.params.userId }, { userId: null }]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Mark a notification as read
router.put("/read/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

module.exports = router;
