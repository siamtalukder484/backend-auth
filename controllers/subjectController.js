const paginate = require("mongoose-pagination-v2");
const Subject = require("../models/Subject");

const createSubject = async (req, res) => {
  const { creatorId, name, code, credits, description } = req.body;
  if (!creatorId || !name || !code) {
    return res.status(400).json({
      success: false,
      message: "Creator ID, name, and code are required.",
    });
  }

  const existingSubject = await Subject.findOne({ code: code.toLowerCase() });

  if (existingSubject) {
    return res.status(409).json({
      success: false,
      message: "A subject with this code already exists.",
    });
  }

  const newSubject = new Subject({
    creatorId,
    name,
    code,
    credits,
    description,
  });
  await newSubject.save();
  res.status(201).json({
    success: true,
    message: "Subject created successfully.",
    data: newSubject,
  });
};
const getSubjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
    };

    const result = await paginate(Subject, {}, options);
    return res.status(200).json({
      success: true,
      message: "Subjects retrieved successfully.",
      data: {
        subjects: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalItems: result.totalDocs,
          itemsPerPage: result.limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve subjects.",
      error: error.message,
    });
  }
};
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, credits, description } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    if (name) subject.name = name;
    if (code) subject.code = code;
    if (credits !== undefined) subject.credits = credits;
    if (description !== undefined) subject.description = description;

    await subject.save();

    res.status(200).json({
      success: true,
      message: "Subject updated successfully.",
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating subject.",
      error: error.message,
    });
  }
};
const deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    await Subject.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting subject.",
      error: error.message,
    });
  }
};
const subjectById = async (req, res) => {
  try {
     let id = req.params
        const subjectInfo = await Subject.findById(id.id)
    
        return res.status(200).json({
          success: true,
          message: "subject retrieved successfully.",
          data: subjectInfo,
        });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve subjects.",
      error: error.message,
    });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  subjectById
};
