import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Student from "@/lib/models/Item";
import { pusher } from "@/lib/pusher";

export async function PUT(request : Request, { params } : {params : {id : string}}) {
  const { id } = params;
  const { name, course, rollNo, batch, timing } = await request.json();

  await connectToDatabase();

  const updatedStudent = await Student.findByIdAndUpdate(
    id,
    { name, course, rollNo, batch, timing },
    { new: true }
  );

  // 🔔 Real-time update event
  await pusher.trigger("students-channel", "student-updated", {
    student: updatedStudent,
  });

  return NextResponse.json(updatedStudent);
}

export async function DELETE(request : Request, { params } : {params : {id : string}}) {
  const { id } = params;

  await connectToDatabase();
  await Student.findByIdAndDelete(id);

  // 🔔 Real-time delete event
  await pusher.trigger("students-channel", "student-deleted", {
    id,
  });

  return NextResponse.json({ message: "Student deleted successfully" });
}
