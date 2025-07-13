const express = require("express")
const User = require("../models/User")

const createUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.create({ username, email });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sendFriendRequest = async (req, res) => {
  const { fromId, toId } = req.body;
  if (fromId === toId) return res.status(400).json({ error: "Can't add yourself" });

  const fromUser = await User.findById(fromId);
  const toUser = await User.findById(toId);

  if (!fromUser || !toUser) return res.status(404).json({ error: "User not found" });
  if (toUser.friendRequests.includes(fromId))
    return res.status(400).json({ error: "Already sent request" });

  toUser.friendRequests.push(fromId);
  fromUser.sentRequests.push(toId);
  await toUser.save();
  await fromUser.save();

  res.json({ message: "Friend request sent" });
};

const acceptFriendRequest = async (req, res) => {
  const { userId, fromId } = req.body;

  const user = await User.findById(userId);
  const fromUser = await User.findById(fromId);

  if (!user || !fromUser) return res.status(404).json({ error: "User not found" });

  user.friendRequests = user.friendRequests.filter((id) => id.toString() !== fromId);
  fromUser.sentRequests = fromUser.sentRequests.filter((id) => id.toString() !== userId);

  user.friends.push(fromId);
  fromUser.friends.push(userId);

  await user.save();
  await fromUser.save();

  res.json({ message: "Friend request accepted" });
};

const declineFriendRequest = async (req, res) => {
  const { userId, fromId } = req.body;

  const user = await User.findById(userId);
  const fromUser = await User.findById(fromId);

  if (!user || !fromUser) return res.status(404).json({ error: "User not found" });

  user.friendRequests = user.friendRequests.filter((id) => id.toString() !== fromId);
  fromUser.sentRequests = fromUser.sentRequests.filter((id) => id.toString() !== userId);

  await user.save();
  await fromUser.save();

  res.json({ message: "Friend request declined" });
};

const getFriendData = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .populate("friends", "username")
    .populate("friendRequests", "username")
    .populate("sentRequests", "username");

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    username: user.username,
    friends: user.friends,
    incomingRequests: user.friendRequests,
    sentRequests: user.sentRequests,
  });
};

const router = express.Router();

router.post("/register", createUser);
router.post("/friend-request", sendFriendRequest);
router.post("/accept-request", acceptFriendRequest);
router.post("/decline-request", declineFriendRequest);
router.get("/user/:id", getFriendData);

module.exports = router;
