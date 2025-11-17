import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  players: z
    .array(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        schoolIdUrl: z
          .string()
          .min(1, "School ID image is required")
          .refine((val) => val.startsWith("data:image/"), {
            message: "School ID must be a valid base64 image",
          }),
      })
    )
    .min(1)
    .max(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Create team with players
    const team = await prisma.team.create({
      data: {
        schoolName: validatedData.schoolName,
        players: {
          create: validatedData.players.map((player) => ({
            firstName: player.firstName,
            lastName: player.lastName,
            schoolIdUrl: player.schoolIdUrl,
          })),
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        team,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to register team",
      },
      { status: 500 }
    );
  }
}
