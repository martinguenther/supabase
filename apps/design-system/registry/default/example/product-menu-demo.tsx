import { ProductMenu } from '@studio/components/ui/ProductMenu/index'

export default function ProductMenuDemo() {
  return (
    <ProductMenu
      page="overview"
      menu={[
        {
          key: 'main',
          items: [
            { name: 'Overview', key: 'overview', url: '/overview' },
            { name: 'Invocations', key: 'invocations', url: '/invocations' },
            { name: 'Logs', key: 'logs', url: '/logs' },
            { name: 'Code', key: 'code', url: '/code' },
          ],
        },
      ]}
    />
  )
}
