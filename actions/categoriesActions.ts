'use server'
export const getCategories = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/categories`);
    if(response.ok) {
        const data = await response.json()
        return data
    }
    return []
}