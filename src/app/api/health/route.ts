import { dbConnectionTest } from "@/app/db";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
    const isConnected = await dbConnectionTest();


    if (isConnected) {
        return NextResponse.json({
            message: "Database connected successfully"
        }, { status: 200 });
    } else {
        return NextResponse.json({
            message: "Database connection failed"
        }, { status: 500 });
    }
}

// export async function POST(): Promise<Response> {
//     const isConnected = await dbConnectionTest();

//     if (isConnected) {
//         return new Response(JSON.stringify({ message: "Database connected successfully" }), { status: 200 });
//     } else {
//         return new Response(JSON.stringify({ message: "Database connection failed" }), { status: 500 });
//     }
// }