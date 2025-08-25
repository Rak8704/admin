import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

// PUT /api/sub-admins/[id] - Update a sub-admin
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role } = body;
    const { id } = params;

    // Validate input
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const existingAdmin = await db.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
      role,
    };

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update admin
    const admin = await db.admin.update({
      where: { id },
      data: updateData,
    });

    // Remove password from response
    const { password: pwd, ...adminWithoutPassword } = admin;

    return NextResponse.json(adminWithoutPassword);
  } catch (error) {
    console.error("Error updating sub-admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/sub-admins/[id] - Delete a sub-admin
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Check if admin exists
    const existingAdmin = await db.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    // Delete admin
    await db.admin.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sub-admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}