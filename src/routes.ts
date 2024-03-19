export const routes = [
  {
    path: '/',
    redirect: '/mouse-follow',
  },
  {
    path: '/mouse-follow',
    component: () => import('./demos/mouse-follow/index.vue'),
    meta: {
      desc: '鼠标跟随插件演示',
    },
  },
  {
    path: '/sort',
    component: () => import('./demos/sort/index.vue'),
    meta: {
      desc: '排序插件演示',
    },
  },
  {
    path: '/auxiliaryLine',
    component: () => import('./demos/auxiliaryLine/index.vue'),
    meta: {
      desc: '低代码辅助线',
    },
  },
]
