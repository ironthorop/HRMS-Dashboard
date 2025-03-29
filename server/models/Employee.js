const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    department: {
      type: String,
      // required: [true, "Department is required"],1
      trim: true,
    },
    // joiningDate: {
    //   type: Date,
    //   required: [true, "Joining date is required"],
    // },
    // salary: {
    //   type: Number,
    //   required: [true, "Salary is required"],
    // },
    status: {
      type: String,
      enum: ["active", "inactive", "on_leave", "terminated"],
      default: "active",
    },
    // address: {
    //   street: String,
    //   city: String,
    //   state: String,
    //   zipCode: String,
    //   country: String,
    // },
    // documents: [
    //   {
    //     name: String,
    //     path: String,
    //     uploadDate: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],
    // emergencyContact: {
    //   name: String,
    //   relationship: String,
    //   phone: String,
    // },
    // bankDetails: {
    //   accountName: String,
    //   accountNumber: String,
    //   bankName: String,
    //   ifscCode: String,
    // },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // }
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
