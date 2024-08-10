export type Post = {
    _id:string,
    creator: string,
    title: string,
    description: string,
    categories: string[],
    image: string
}

export type Category = {
    _id: string,
    name:string,
}

