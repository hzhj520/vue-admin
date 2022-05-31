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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    path: 'diff',
    name: 'Diff',
    component: () =>
      import('@/views/diff/index'),
    meta: {
      title: '代码差分',
      icon: 'table'
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
// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

export const asyncRoutes = [
  {
    path: '/version',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: {
      title: '版本管理',
      icon: 'el-icon-s-help'
    },
    children: [{
      path: 'harbor',
      name: 'Harbor',
      component: () =>
        import('@/views/harbor/index'),
      meta: {
        title: '镜像管理',
        icon: 'table'
      }
    },
    {
      path: 'file',
      name: 'File',
      component: () =>
        import('@/views/file/index'),
      meta: {
        title: '软件管理',
        icon: 'tree',
        roles: ['admin']
      }
    }, {
      path: 'download',
      name: 'Download',
      component: () =>
        import('@/views/download/index'),
      meta: {
        title: '软件下载',
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
