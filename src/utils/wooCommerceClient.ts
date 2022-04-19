import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { restUrl, wooCommerceApiClient, wooCommerceApiSecret } from './path'

const WooCommerceClient = async (url: string, method: string = 'GET', data: object = null) => {
  const wooCommerce = new WooCommerceRestApi({
    url: restUrl,
    consumerKey: wooCommerceApiClient,
    consumerSecret: wooCommerceApiSecret,
    version: 'wc/v3',
  })

  switch (method) {
    case 'GET':
      const get = await wooCommerce.get(url)
      return get.data
    case 'POST':
      const post = await wooCommerce.post(url, data)
      return post.data
    case 'PUT':
      const put = await wooCommerce.put(url, data)
      return put.data
    case 'DELETE':
      const del = await wooCommerce.get(url)
      return del.data
    default:
      return {}
  }

}

export default WooCommerceClient
