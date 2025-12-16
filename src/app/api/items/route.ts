import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Student from "@/lib/models/Item";
import { pusher } from "@/lib/pusher";

export async function GET() {
  await connectToDatabase();
  const students = await Student.find({});
  return NextResponse.json(students);
}

export async function POST(request : Request) {
  await connectToDatabase();

  const { name, course, rollNo, batch, timing } = await request.json();

  const newStudent = await Student.create({
    name,
    course,
    rollNo,
    batch,
    timing,
  });

  // 🔔 Real-time notification
  await pusher.trigger("students-channel", "student-created", {
    student: newStudent,
  });

  return NextResponse.json(newStudent);
}
