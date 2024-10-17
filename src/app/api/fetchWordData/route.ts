import { NextResponse } from "next/server";
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'fetchWordData', 'data', 'eight_letter_data.txt');

        const data = await fs.readFile(filePath, 'utf-8');

        const words = data.split('\n').map((word) => word.trim()).filter((word) => word.length === 8);

        return NextResponse.json({ words });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
