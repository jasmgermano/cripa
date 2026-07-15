import { NextResponse } from "next/server";
import path from 'path';
import { promises as fs } from 'fs';
import { parseWordLine, type WordEntry } from '@/utils/wordEntries';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'fetchWordData', 'data', 'eight_letter_data.txt');

        const data = await fs.readFile(filePath, 'utf-8');

        const entries = data
            .split('\n')
            .map(parseWordLine)
            .filter((entry): entry is WordEntry => entry !== null && entry.word.replace(/\s+/g, "").length === 8);
        const words = entries.map((entry) => entry.word);

        return NextResponse.json({ words, entries });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
