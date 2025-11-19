import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import argon2 from "argon2";

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServerClient();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Mangler brukernavn eller passord" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("user")
      .select("id, username, password_hash")
      .eq("username", username)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Feil brukernavn eller passord" },
        { status: 401 }
      );
    }

    const ok = await argon2.verify(user.password_hash, password);
    if (!ok) {
      return NextResponse.json(
        { error: "Feil brukernavn eller passord" },
        { status: 401 }
      );
    }

    const token = process.env.NEXT_PUBLIC_TEST ?? "";

    return NextResponse.json({ success: true, token });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
