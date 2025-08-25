import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

// POST /api/sub-admins - Create a new sub-admin
export async function POST(req: Request) {
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

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await db.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await db.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "SUBADMIN",
      },
    });

    // Remove password from response
    const { password: pwd, ...adminWithoutPassword } = admin;

    return NextResponse.json(adminWithoutPassword);
  } catch (error) {
    console.error("Error creating sub-admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/sub-admins - Get all sub-admins
export async function GET() {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admins = await db.admin.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Remove passwords from response
    const adminsWithoutPasswords = admins.map(({ password, ...admin }: any) => admin);

    return NextResponse.json(adminsWithoutPasswords);
  } catch (error) {
    console.error("Error fetching sub-admins:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}