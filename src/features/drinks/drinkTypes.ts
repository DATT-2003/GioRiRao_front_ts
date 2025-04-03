interface ICustomization {
  size: "S" | "M" | "L"
  price: number
}

interface IImage {
  url: string
  alt: string
  order: number
}

interface IIngredient {
  name: string
  quantity: string
  unit: string
}

export interface IDrink {
  _id: string
  name: string
  customization: ICustomization[]
  description: string
  shortDescription: string
  slug?: string
  thumbnail: string
  // images?: IImage[]
  ingredients?: IIngredient[]
  recipe?: string
  flags: {
    isBestSeller: boolean
    isNew: boolean
    isSeasonSpecial: boolean
  }
  category: string
  tags: string[]
}
