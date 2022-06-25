// product.js
const Layout = () => import('@/layout/index.vue')
const Product = () => import('@/views/product/index.vue')

export default [
  {
    path: '/product',
    component: Layout,
    name: 'ProductIndex',
    meta: {
      title: '產品管理',
    },
    icon: 'el-icon-menu',
    children: [
      {
        path: '/product',
        name: 'product',
        component: Product,
        meta: {
          title: '產品管理',
          affix: true,
        },
      },
    ],
  },
]
