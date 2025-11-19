export async function GET() {
    return Response.json({
        url: process.env.NEXT_PUBLIC_SUPABSE_URL,
        anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "OK" : "MISSING",
    })
}