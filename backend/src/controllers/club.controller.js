const Club = require("../models/Club");

exports.createClub = async (req, res) => {
  try {
    const clubData = {
      ...req.body,
      coordinator: req.user.id,
      status: "Pending", // All new clubs start as pending
    };

    // Handle image upload if present
    if (req.file) {
      clubData.image = `/uploads/clubs/${req.file.filename}`;
    }

    const club = new Club(clubData);
    await club.save();
    res.status(201).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

exports.getClubs = async (req, res) => {
  try {
    let query = {};
    
    // Students only see approved clubs
    if (req.user.role === "student") {
      query.status = "Approved";
    } else if (req.query.status) {
      // Admins and others can filter by status
      query.status = req.query.status;
    }
    // Admins see all clubs
    // Club coordinators see their own clubs (all statuses)
    
    const clubs = await Club.find(query)
      .populate("coordinator", "name email")
      .populate("members", "name email")
      .populate("approvedBy", "name");
    
    res.status(200).json({ success: true, data: clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ status: "Pending" })
      .populate("coordinator", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("coordinator", "name email")
      .populate("members", "name email")
      .populate("joinRequests.student", "name email");
    
    if (!club) {
      return res
        .status(404)
        .json({ success: false, message: "Club not found" });
    }
    res.status(200).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateClub = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle image upload if present
    if (req.file) {
      updateData.image = `/uploads/clubs/${req.file.filename}`;
    }
    
    const club = await Club.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    
    if (!club) {
      return res
        .status(404)
        .json({ success: false, message: "Club not found" });
    }
    res.status(200).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res
        .status(404)
        .json({ success: false, message: "Club not found" });
    }
    
    // Check if user is authorized to delete this club
    // Admins can delete any club, coordinators can only delete their own clubs
    if (req.user.role !== "admin" && club.coordinator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "You are not authorized to delete this club" });
    }
    
    await Club.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Club deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin approves club
exports.approveClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { 
        status: "Approved", 
        approvedBy: req.user.id 
      },
      { new: true }
    );
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    res.status(200).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin rejects club
exports.rejectClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    res.status(200).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student sends join request
exports.sendJoinRequest = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    if (club.status !== "Approved") {
      return res.status(400).json({ success: false, message: "Club is not approved yet" });
    }
    
    const userId = req.user.id;
    
    // Check if already a member
    if (club.members.includes(userId)) {
      return res.status(400).json({ success: false, message: "Already a member" });
    }
    
    // Check if request already exists
    const existingRequest = club.joinRequests.find(
      req => req.student.toString() === userId && req.status === "Pending"
    );
    
    if (existingRequest) {
      return res.status(400).json({ success: false, message: "Join request already sent" });
    }
    
    club.joinRequests.push({
      student: userId,
      status: "Pending",
    });
    
    await club.save();
    
    res.status(200).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Coordinator approves join request
exports.approveMember = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    const { userId } = req.params;
    const joinRequest = club.joinRequests.find(
      req => req.student.toString() === userId && req.status === "Pending"
    );
    
    if (!joinRequest) {
      return res.status(404).json({ success: false, message: "Join request not found" });
    }
    
    // Update request status
    joinRequest.status = "Approved";
    
    // Add to members
    if (!club.members.includes(userId)) {
      club.members.push(userId);
    }
    
    await club.save();
    
    res.status(200).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Coordinator rejects join request
exports.rejectMember = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    const { userId } = req.params;
    const joinRequest = club.joinRequests.find(
      req => req.student.toString() === userId && req.status === "Pending"
    );
    
    if (!joinRequest) {
      return res.status(404).json({ success: false, message: "Join request not found" });
    }
    
    joinRequest.status = "Rejected";
    await club.save();
    
    res.status(200).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get join requests for a club (coordinator only)
exports.getJoinRequests = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("joinRequests.student", "name email rollNumber");
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    // Filter pending requests
    const pendingRequests = club.joinRequests.filter(req => req.status === "Pending");
    
    res.status(200).json({ success: true, data: pendingRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Create news for a club
exports.createNews = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    // Check if user is authorized (coordinator of this club or admin)
    if (req.user.role !== "admin" && club.coordinator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to post news for this club" });
    }
    
    const { title, content } = req.body;
    
    club.news.push({
      title,
      content,
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await club.save();
    
    res.status(201).json({ success: true, data: club.news[club.news.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get news for a club (members only)
exports.getClubNews = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("news.createdBy", "name");
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    // Check if user is a member of the club or admin or coordinator
    const isMember = club.members.some(member => member.toString() === req.user.id);
    const isCoordinator = club.coordinator.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    
    if (!isMember && !isCoordinator && !isAdmin) {
      return res.status(403).json({ success: false, message: "You must be a member to view club news" });
    }
    
    // Sort news by creation date (newest first)
    const sortedNews = club.news.sort((a, b) => b.createdAt - a.createdAt);
    
    res.status(200).json({ success: true, data: sortedNews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    const newsItem = club.news.id(req.params.newsId);
    
    if (!newsItem) {
      return res.status(404).json({ success: false, message: "News not found" });
    }
    
    // Check if user is authorized (creator, coordinator, or admin)
    const isCreator = newsItem.createdBy.toString() === req.user.id;
    const isCoordinator = club.coordinator.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    
    if (!isCreator && !isCoordinator && !isAdmin) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this news" });
    }
    
    const { title, content } = req.body;
    
    if (title) newsItem.title = title;
    if (content) newsItem.content = content;
    newsItem.updatedAt = new Date();
    
    await club.save();
    
    res.status(200).json({ success: true, data: newsItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    
    const newsItem = club.news.id(req.params.newsId);
    
    if (!newsItem) {
      return res.status(404).json({ success: false, message: "News not found" });
    }
    
    // Check if user is authorized (creator, coordinator, or admin)
    const isCreator = newsItem.createdBy.toString() === req.user.id;
    const isCoordinator = club.coordinator.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    
    if (!isCreator && !isCoordinator && !isAdmin) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this news" });
    }
    
    newsItem.deleteOne();
    await club.save();
    
    res.status(200).json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
