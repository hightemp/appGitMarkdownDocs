
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
        { path: '', component: () => import('pages/Index.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error.vue')
  })
}

export default routes
