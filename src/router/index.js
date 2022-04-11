/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () =>
        import('@/views/dashboard/index.vue'),
      meta: {
        title: '研发中心风采',
        icon: 'dashboard'
      }
    }]
  },

  {
    path: '/codemanage',
    component: Layout,
    redirect: '/codemanage/branch',
    name: 'CodeManage',
    meta: {
      title: '代码管理',
      icon: 'el-icon-s-help'
    },
    children: [{
        path: 'branch',
        name: 'Branch',
        component: () =>
          import('@/views/branch/index'),
        meta: {
          title: '分支管理',
          icon: 'table'
        }
      },
      {
        path: 'patch',
        name: 'Patch',
        component: () =>
          import('@/views/patch/index'),
        meta: {
          title: '代码变更历史',
          icon: 'tree'
        }
      },
      {
        path: 'tree2',
        name: 'Tree2',
        hidden: true,
        component: () =>
          import('@/views/table/index'),
        meta: {
          title: 'patch检索',
          icon: 'tree'
        }
      },
      {
        path: 'tree3',
        name: 'Tree3',
        component: () =>
          import('@/views/table/index'),
        meta: {
          title: '代码差分',
          icon: 'tree'
        }
      }, {
        path: 'table4',
        name: 'Table4',
        component: () =>
          import('@/views/table/index'),
        meta: {
          title: '代码发布记录',
          icon: 'table'
        }
      }, {
        path: 'table5',
        name: 'Table5',
        component: () =>
          import('@/views/table/index'),
        meta: {
          title: '参考代码下载',
          icon: 'table'
        }
      },
    ]
  },
  {
    path: '/example1',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: {
      title: '版本管理',
      icon: 'el-icon-s-help'
    },
    children: [{
        path: 'table6',
        name: 'Table6',
        component: () =>
          import('@/views/table/index'),
        meta: {
          title: '环境管理',
          icon: 'table'
        }
      },
      {
        path: 'tree7',
        name: 'Tree7',
        component: () =>
          import('@/views/tree/index'),
        meta: {
          title: '版本检索',
          icon: 'tree'
        }
      }, {
        path: 'table8',
        name: 'Table8',
        component: () =>
          import('@/views/table/index'),
        meta: {
          title: '版本变更记录',
          icon: 'table'
        }
      },
    ]
  },
  {
    path: '/dashboard2',
    component: Layout,
    children: [{
      path: 'dashboard2',
      name: 'Dashboard2',
      component: () =>
        import('@/views/dashboard/index.vue'),
      meta: {
        title: '工具箱',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/urls',
    component: Layout,
    children: [{
      path: 'index',
      name: 'URL',
      component: () =>
        import('@/views/url/index'),
      meta: {
        title: '常用链接',
        icon: 'form'
      }
    }]
  },
  // {
  //   path: '/url',
  //   component: Layout,
  //   children: [{
  //     path: 'index2',
  //     name: 'URL',
  //     component: () =>
  //       import('@/views/url/index2'),
  //     meta: {
  //       title: '常用链接2',
  //       icon: 'form'
  //     }
  //   }]
  // },
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     name: 'Form',
  //     component: () =>
  //       import('@/views/form/index'),
  //     meta: {
  //       title: 'Form',
  //       icon: 'form'
  //     }
  //   }]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [{
  //       path: 'menu1',
  //       component: () =>
  //         import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: {
  //         title: 'Menu1'
  //       },
  //       children: [{
  //           path: 'menu1-1',
  //           component: () =>
  //             import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: {
  //             title: 'Menu1-1'
  //           }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () =>
  //             import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: {
  //             title: 'Menu1-2'
  //           },
  //           children: [{
  //               path: 'menu1-2-1',
  //               component: () =>
  //                 import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: {
  //                 title: 'Menu1-2-1'
  //               }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () =>
  //                 import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: {
  //                 title: 'Menu1-2-2'
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () =>
  //             import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: {
  //             title: 'Menu1-3'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () =>
  //         import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: {
  //         title: 'menu2'
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [{
  //     path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //     meta: {
  //       title: '外部链接',
  //       icon: 'link'
  //     }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
