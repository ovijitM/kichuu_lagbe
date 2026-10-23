import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { Notification } from "../models/Notification.js";

const router = Router();

router.use(protect);

const DEFAULT_NOTIFICATIONS_BY_ROLE = {
  resident: [
    {
      title: "Internal Runner Assigned",
      body: "Rider Hasan is picking up your Kinley 20L Water Jar from Block G Warehouse. ETA: 14 mins.",
      read: false,
    },
    {
      title: "Gate 2 Security Clearance Synced",
      body: "Pre-cleared intercom PIN #4892 sent to gate guard. Zero delay entering Block D.",
      read: false,
    },
    {
      title: "Midnight Crave Active",
      body: "Crave More! Till 4:00 AM — Fresh bakery, snacks, and dairy dispatch active across Bashundhara R/A.",
      read: true,
    },
  ],
  shop_owner: [
    {
      title: "New Instant Order #KL-9104",
      body: "Resident Mahmudul Hasan ordered 2 items in Block D. Expected packing time: 3 mins.",
      read: false,
    },
    {
      title: "Runner En Route to Counter",
      body: "Rider Hasan assigned to collect Order #KL-9088 from your storefront.",
      read: false,
    },
    {
      title: "Daily Sales Milestone",
      body: "Your storefront crossed ৳42,000 in local orders today. Keep stock updated!",
      read: true,
    },
  ],
  service_provider: [
    {
      title: "New Emergency Call-out",
      body: "Dr. Farhan Chowdhury requested DB Box Short Circuit check at Block D, Road 11 Apt 4B.",
      read: false,
    },
    {
      title: "Building Gate Clearance Granted",
      body: "Pre-approved technician entry pass active for Block C, Road 8. Intercom linked.",
      read: false,
    },
    {
      title: "5-Star Review Received",
      body: "Resident Mahmudul Hasan rated your AC Jet Wash service 5.0 stars with verified badge.",
      read: true,
    },
  ],
  rider: [
    {
      title: "New Pickup Dispatch",
      body: "Order #KL-9104 ready for collection at Block G Central Warehouse for Block D Road 11.",
      read: false,
    },
    {
      title: "Internal Sector Bonus",
      body: "Complete 2 more internal gate trips today to unlock ৳150 fuel allowance.",
      read: false,
    },
  ],
  admin: [
    {
      title: "New Merchant Verification",
      body: "Bashundhara Fresh Hub uploaded updated storefront branding and trade certificate.",
      read: false,
    },
    {
      title: "Gate Perimeter Fleet Status",
      body: "Gates 1, 2, and 3 reporting clear flow. Average transit holding steady at 21 mins.",
      read: true,
    },
  ],
};

router.get("/", async (req, res, next) => {
  try {
    let notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Seed initial demo notifications if user has none
    if (notifications.length === 0) {
      const initialSeed = DEFAULT_NOTIFICATIONS_BY_ROLE[req.user.role] || DEFAULT_NOTIFICATIONS_BY_ROLE.resident;
      notifications = await Promise.all(
        initialSeed.map((item) =>
          Notification.create({
            user: req.user.id,
            title: item.title,
            body: item.body,
            read: item.read,
          })
        )
      );
    }

    res.json({
      notifications: notifications.map((n) => ({
        id: n._id.toString(),
        title: n.title,
        body: n.body,
        read: Boolean(n.read),
        createdAt: n.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ notification });
  } catch (error) {
    next(error);
  }
});

router.post("/read-all", async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user.id }, { read: true });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
