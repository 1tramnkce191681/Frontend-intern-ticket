import { NextRequest, NextResponse } from "next/server";
import { Comment } from "@/types";

// Mock comments data
const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "1",
      ticketId: "1",
      content: "We are investigating this issue",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "2": [
    {
      id: "2",
      ticketId: "2",
      content: "Working on performance optimization",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "3": [
    {
      id: "3",
      ticketId: "3",
      content: "Feature successfully deployed to production",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = mockComments[id] || [];

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content } = await request.json();

    if (!mockComments[id]) {
      mockComments[id] = [];
    }

    const newComment: Comment = {
      id: String(Object.values(mockComments).flat().length + 1),
      ticketId: id,
      content,
      createdAt: new Date().toISOString(),
    };

    mockComments[id].push(newComment);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 400 }
    );
  }
}
