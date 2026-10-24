const Course = require('../models/Course');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Career = require('../models/Career');

// Courses
const getCourses = async (req, res) => {
  try {
    const { domain, difficulty } = req.query;
    const filter = {};
    if (domain) filter.domain = new RegExp(domain, 'i');
    if (difficulty) filter.difficulty = difficulty;

    const courses = await Course.find(filter).sort({ title: 1 });
    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses.', error: err.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, message: 'Course created successfully.', course });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to create course.', error: err.message });
  }
};

// Skills
const getSkills = async (req, res) => {
  try {
    const { category, domain } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (domain) filter.domain = new RegExp(domain, 'i');

    const skills = await Skill.find(filter).sort({ name: 1 });
    res.status(200).json({ success: true, count: skills.length, skills });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch skills.', error: err.message });
  }
};

const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, message: 'Skill created successfully.', skill });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to create skill.', error: err.message });
  }
};

// Projects
const getProjects = async (req, res) => {
  try {
    const { difficulty, domain } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (domain) filter.domain = new RegExp(domain, 'i');

    const projects = await Project.find(filter).sort({ title: 1 });
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch capstone projects.', error: err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, message: 'Capstone project created successfully.', project });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to create project.', error: err.message });
  }
};

// Careers
const getCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ title: 1 });
    res.status(200).json({ success: true, count: careers.length, careers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch careers.', error: err.message });
  }
};

const createCareer = async (req, res) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ success: true, message: 'Career path created successfully.', career });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to create career.', error: err.message });
  }
};

module.exports = {
  getCourses,
  createCourse,
  getSkills,
  createSkill,
  getProjects,
  createProject,
  getCareers,
  createCareer,
};
