/**
 * Companies API Route
 * 
 * Handles GET requests for paginated company data.
 * Supports query parameters:
 * - page: Current page number (default: 1)
 * - pageSize: Number of items per page (default: 10)
 */

import { NextResponse } from 'next/server';
import {companies} from '@/constant'


export async function GET(req:Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const result = companies.slice(start, end);
    
    return NextResponse.json({
        companies: result,
        hasMore: end < companies.length,
        totalItems: companies.length,
        page: page,
        totalPages: Math.ceil(companies.length / pageSize),
    });
}