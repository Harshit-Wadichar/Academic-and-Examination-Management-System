const Hall = require('../models/Hall');

// Get all halls
// GET /api/halls
exports.getAllHalls = async (req, res) => {
  try {
    const halls = await Hall.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ 
      success: true, 
      data: halls 
    });
  } catch (error) {
    console.error('getAllHalls error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch halls' 
    });
  }
};

// Get a single hall by ID
// GET /api/halls/:id
exports.getHallById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hall not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: hall 
    });
  } catch (error) {
    console.error('getHallById error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch hall' 
    });
  }
};

// Create a new hall
// POST /api/halls
exports.createHall = async (req, res) => {
  try {
    const { name, capacity, location } = req.body;

    if (!name || !capacity || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, capacity, and location are required' 
      });
    }

    // Check if hall with same name already exists
    const existingHall = await Hall.findOne({ name });
    if (existingHall) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hall with this name already exists' 
      });
    }

    const hall = new Hall({
      name,
      capacity,
      location,
      createdBy: req.user?.id
    });

    await hall.save();
    res.status(201).json({ 
      success: true, 
      message: 'Hall created successfully', 
      data: hall 
    });
  } catch (error) {
    console.error('createHall error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hall with this name already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create hall' 
    });
  }
};

// Update a hall
// PUT /api/halls/:id
exports.updateHall = async (req, res) => {
  try {
    const { name, capacity, location } = req.body;

    // Check if hall with same name already exists (excluding current hall)
    if (name) {
      const existingHall = await Hall.findOne({ 
        name, 
        _id: { $ne: req.params.id } 
      });
      if (existingHall) {
        return res.status(400).json({ 
          success: false, 
          message: 'Hall with this name already exists' 
        });
      }
    }

    const hall = await Hall.findByIdAndUpdate(
      req.params.id,
      { name, capacity, location },
      { new: true, runValidators: true }
    );

    if (!hall) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hall not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Hall updated successfully', 
      data: hall 
    });
  } catch (error) {
    console.error('updateHall error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hall with this name already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update hall' 
    });
  }
};

// Delete a hall (soft delete by setting isActive to false)
// DELETE /api/halls/:id
exports.deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!hall) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hall not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Hall deleted successfully' 
    });
  } catch (error) {
    console.error('deleteHall error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete hall' 
    });
  }
};

