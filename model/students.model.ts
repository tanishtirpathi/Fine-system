import mongoose, { Schema } from 'mongoose';
import { Student } from '../types/student.types';

const StudentSchema: Schema = new Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fatherNo: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    fineAmount: { type: Number, required: true },
    fineStatus: { type: String, enum: ['paid', 'unpaid'], required: true },
    isCleared: { type: Boolean, required: true }
}, {
    timestamps: true,
});

const StudentModel = mongoose.model<Student>('Student', StudentSchema);

export default StudentModel;