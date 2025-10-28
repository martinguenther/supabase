import { ProductMenu } from '@studio/components/ui/ProductMenu/index'

export default function ProductMenuDemo() {
  return (
    <ProductMenu
      page="overview"
      menu={[
        {
          key: 'main',
          items: [
            { name: 'Overview', key: 'overview', url: '#' },
            { name: 'Invocations', key: 'invocations', url: '#' },
            { name: 'Logs', key: 'logs', url: '#' },
            { name: 'Code', key: 'code', url: '#' },
          ],
        },
      ]}
    />
  )
}
