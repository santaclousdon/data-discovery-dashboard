import { NextResponse } from 'next/server';
import {companies} from '@/constant'


export async function GET(req:Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '5', 10);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const result = companies.slice(start, end);
    return NextResponse.json({
        companies: result,
        total: companies.length,
      });
}