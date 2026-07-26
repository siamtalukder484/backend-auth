const Subject = require("../models/Subject");

const createSubject = async (req, res) => {
    const {creatorId, name, code, credits, description} = req.body;
    if (!creatorId || !name || !code) {
      return res.status(400).json({
        success: false,
        message: "Creator ID, name, and code are required.",
      });
    }
    const newSubject = new Subject({
        creatorId,
        name,
        code,
        credits,
        description
    });
    await newSubject.save();
    res.status(201).json({
        success: true,
        message: "Subject created successfully.",
        data: newSubject
    });
};
const getSubjects = async (req, res) => {
    const subjects = await Subject.find();
    res.status(200).json({
        success: true,
        data: subjects
    });
};
const deleteSubject = async (req, res)=> {
    const { id } = req.params;
    try {
        await Subject.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Subject deleted successfully."
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting subject.",
            error: error.message
        });
    }
}

module.exports = {
  createSubject,
  getSubjects,
  deleteSubject
};
