import mongoose, { Schema } from 'mongoose';
import { Teacher } from '../types/teacher.types';

const TeacherSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, trim: true, required: true },
  password: { type: String, required: true },
  phoneNo: { type: String, unique: true, trim: true, required: true },
  department: { type: String, required: true },
});

const TeacherModel = mongoose.model<Teacher>('Teacher', TeacherSchema);

export default TeacherModel;