'use server'

//Get Categories
export const getCategories = async () => {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/categories`);
    if(response.ok) {
        const data = await response.json()
        return data
    }
    return []
}