import { WooCommerceClient } from "./utils"

const prices: any = {
  products: {
    4419: 6.5
  },
  variations: {
    'FRESH N´ HOLY EXTRA': {
      'Holy Slaw': 0.5,
      'Veggies': 0.5,
      'N/A': 0
    },
    'HOLY BLESSINGS EXTRA': {
      'N/A': 0,
      'Papas Fritas': 2,
      'Queso Cheddar': 0.5,
      'Tocineta': 1
    }
  }
}

const main = async () => {
  const products = await WooCommerceClient('products?per_page=100')

  for (const product of products) {

    const pages = Math.ceil(product?.variations?.length / 100)
    let variations: any = []

    for (let i = 1; i <= pages; i++) {
      const productVariations = await WooCommerceClient(`products/${product.id}/variations?per_page=100&page=${i}`)
      variations = [...variations, ...productVariations]
    }

    const basePrice = prices.products[product.id]

    for (const variation of variations) {
      let newPrice = basePrice
      if (newPrice) {
        const attributes = []
        for (const attr of variation.attributes) {
          const variationPrice = prices.variations[attr?.name][attr?.option]
          attributes.push(attr?.option)
          if (variationPrice) newPrice += variationPrice
        }

        await WooCommerceClient(`products/${product.id}/variations/${variation.id}`, 'PUT', { 'regular_price': newPrice.toString() })
        console.log('variation updated:', variation.id, 'Price: ', newPrice, 'Attributes: ', attributes.join(' '))
      }
    }
  }
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
runMain()