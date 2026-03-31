import Course from "../models/Course.js";

// CREATE COURSE (Admin)
export const createCourse = async (req, res) => {
  try {
    const { name, code } = req.body;

    const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const course = await Course.create({
      name,
      code,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ASSIGN TEACHER
export const assignTeacher = async (req, res) => {
  try {
    const { courseId, teacherId } = req.body;

    // check teacher exists
    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({ message: "Invalid teacher" });
    }

    // update course
    const course = await Course.findByIdAndUpdate(
      courseId,
      { teacher: teacherId },
      { new: true }
    ).populate("teacher", "name email");

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "name email");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // prevent duplicate enroll
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(studentId);
    await course.save();

    res.json({ message: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const courses = await Course.find({
      students: studentId,
    }).populate("teacher", "name email");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
