import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";

// @route GET /api/students?vadan=Dhol
export const getStudents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.vadan) filter.vadan = req.query.vadan;

    const students = await Student.find(filter).sort({ firstName: 1 });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route POST /api/students
export const createStudent = async (req, res) => {
  try {
    const { firstName, middleName, lastName, vadan, contactNumber, gender } = req.body;

    if (!firstName || !lastName || !vadan || !contactNumber || !gender) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const student = await Student.create({
      firstName,
      middleName,
      lastName,
      vadan,
      contactNumber,
      gender,
    });

    return res.status(201).json(student);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { firstName, middleName, lastName, vadan, contactNumber, gender } = req.body;

    student.firstName = firstName ?? student.firstName;
    student.middleName = middleName ?? student.middleName;
    student.lastName = lastName ?? student.lastName;
    student.vadan = vadan ?? student.vadan;
    student.contactNumber = contactNumber ?? student.contactNumber;
    student.gender = gender ?? student.gender;

    const updated = await student.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await student.deleteOne();
    await Attendance.deleteMany({ student: student._id });

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
