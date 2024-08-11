import { connectToDB } from "@utils/database";
import Category from "@models/categoryModel";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDB()
        const categories = await Category.find({})

        return NextResponse.json(categories,{status:200})
    } catch (error) {
        return NextResponse.json({message: 'Failed to fetch for categories'},{status:500})
    }
}