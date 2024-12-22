const isValidURL = require("../helpers/isValidURL");
const Job = require("../models/jobs");
const User = require("../models/user");

// Get All Jobs
exports.getAllJobs = async (req, res) => {
  try {

    const jobs = await Job.findAll({ include: {  model: User, attributes: ['name', 'email']} });

    res.status(200).json(jobs);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Get Latest (num) jobs
exports.getLatestJobs = async (req, res) => {
  try {

    const num = parseInt(req.params.num, 10);

    if (isNaN(num) || num <= 0) {
      return res.status(400).json({ message: "Invalid number of jobs" });
    }

    const jobs = await Job.findAll({ limit: num, include: { model: User, attributes: ['name', 'email'] }, order: [[ 'createdAt', 'DESC' ]] });

    res.status(200).json(jobs);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Get Job by ID
exports.getJobById = async (req, res) => {
  try {

    const { id } = req.params;

    const job = await Job.findByPk(id, { include: { model: User, attributes: ['name', 'email'] }});

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Create Job
exports.createNewJob = async (req, res) => {
  try {

    const { title, description, companyName, location, jobURL, salary, hasVisaSponsorship, isJobRemote } = req.body;

    const userId = req.user.id

    if (!title || !description || !companyName || !location || !jobURL || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isValidURL(jobURL) === false) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    // Check if salary is number
    if (isNaN(salary) && salary !== "Conditional") {
      return res.status(400).json({ message: "Salary must be a number" });
    }

    const job = await Job.create({
      title,
      description,
      companyName,
      location,
      jobURL,
      salary,
      hasVisaSponsorship,
      isJobRemote,
      createdBy: userId,
    });

    res.status(201).json(job);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Update Job
exports.updateJob = async (req, res) => {

  try {

    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this job" });
    }

    const { title, description, companyName, location, jobURL, salary, hasVisaSponsorship, isJobRemote } = req.body;

    if (jobURL) {
      if (isValidURL(jobURL) === false) {
        return res.status(400).json({ message: "Invalid URL" });
      }
    }

    if (salary) {
      // Check if salary is number
      if (isNaN(salary) && salary !== "Conditional") {
        return res.status(400).json({ message: "Salary must be a number" });
      }
    }

    await job.update({
      title: title || job.title,
      description: description || job.description,
      companyName: companyName || job.companyName,
      location: location || job.location,
      jobURL: jobURL || job.jobURL,
      salary: salary || job.salary,
      hasVisaSponsorship: hasVisaSponsorship || job.hasVisaSponsorship,
      isJobRemote: isJobRemote || job.isJobRemote,
    });

    res.status(200).json(job);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Delete Job
exports.deleteJob = async (req, res) => {
  try {

    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this job" });
    }

    await job.destroy();

    res.status(204).send();

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}