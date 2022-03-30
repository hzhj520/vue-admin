<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div class="box-container">
          <a class="link-btn" href="http://gerrit.eswin.cn" target="_black">
            <img src="https://img.dianzhangzhipin.com/blueapp/header/images/image/20210526/32f674987314258627f953b4fb72f692.jpg?x-oss-process=image/resize,w_200" alt="">
            <span>代码评审</span>
          </a>
          <a class="link-btn" href="http://10.100.130.52:8080" target="_black">
            <img src="http://gerrit.eswin.cn/static/jira-logo-scaled.png" alt="">
            <span>版本构建</span>
          </a>
          <a class="link-btn" href="https://oa.eswin.com" target="_black">
            <img src="https://img.dianzhangzhipin.com/blueapp/header/images/image/20210526/32f674987314258627f953b4fb72f692.jpg?x-oss-process=image/resize,w_200" alt="">
            <span>OA系统</span>
          </a>
        </div>
        <div class="box-container">
          <a class="link-btn" href="http://mail.eswin.com" target="_black">
            <img src="https://img.dianzhangzhipin.com/blueapp/header/images/image/20210526/32f674987314258627f953b4fb72f692.jpg?x-oss-process=image/resize,w_200" alt="">
            <span>邮件系统</span>
          </a>
          <a class="link-btn" href="http://jira.eswin.com" target="_black">
            <img src="https://img.dianzhangzhipin.com/blueapp/header/images/image/20210526/32f674987314258627f953b4fb72f692.jpg?x-oss-process=image/resize,w_200" alt="">
            <span>JIRA系统</span>
          </a>
          <a class="link-btn" href="http://10.12.130.2:8080/source" target="_black">
            <img src="https://img.dianzhangzhipin.com/blueapp/header/images/image/20210526/32f674987314258627f953b4fb72f692.jpg?x-oss-process=image/resize,w_200" alt="">
            <span>代码检索</span>
          </a>
        </div>
      </el-card>
    </el-row>

  </div>
</template>

<script>
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  name: 'ComponentMixinDemo',
  directives: {
    waves
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入六个字符'))
      } else {
        callback()
      }
    }
    return {
      demo: {
        title: ''
      },
      demoRules: {
        title: [{ required: true, trigger: 'change', validator: validate }]
      },
      articleList: [
        { title: '基础篇', href: 'https://juejin.im/post/59097cd7a22b9d0065fb61d2' },
        { title: '登录权限篇', href: 'https://juejin.im/post/591aa14f570c35006961acac' },
        { title: '实战篇', href: 'https://juejin.im/post/593121aa0ce4630057f70d35' },
        { title: 'vue-admin-template 篇', href: 'https://juejin.im/post/595b4d776fb9a06bbe7dba56' },
        { title: 'v4.0 篇', href: 'https://juejin.im/post/5c92ff94f265da6128275a85' },
        { title: '优雅的使用 icon', href: 'https://juejin.im/post/59bb864b5188257e7a427c09' }
      ]
    }
  }
}
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item {
  min-height: 100px;
}
.box-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.link-btn {
  width: 200px;
  flex: 0 0 30%;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 20px 20px 0;
}
.link-btn img {
  width: 100px;
  line-height: 140px;
}
.link-btn span {
  line-height: 140px;
  height: 140px;
}
.hidden {
  visibility: hidden;
}
</style>
