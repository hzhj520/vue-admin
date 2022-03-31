<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div style="margin-bottom:100px;">
          <el-col :span="8" class="text-center">
            <a class="pan-btn blue-btn" href="http://gerrit.eswin.cn" target="_blank">
              代码评审
            </a>
          </el-col>
          <el-col :span="8" class="text-center">
            <a class="pan-btn light-blue-btn" href="http://10.100.130.52:8080" target="_blank">
              版本构建
            </a>
          </el-col>
          <el-col :span="8" class="text-center">
            <a class="pan-btn red-btn" href="https://oa.eswin.com" target="_blank">
              OA系统
            </a>
          </el-col>
        </div>
        <div style="margin-bottom:200px;">
          <el-col :span="8" class="text-center">
            <a class="pan-btn pink-btn" href="http://mail.eswin.com" target="_blank">
              邮件系统
            </a>
          </el-col>
          <el-col :span="8" class="text-center">
            <a class="pan-btn green-btn" href="http://jira.eswin.com" target="_blank">
              JIRA系统
            </a>
          </el-col>
          <el-col :span="8" class="text-center">
            <a class="pan-btn tiffany-btn" href="http://10.12.130.2:8080/source" target="_blank">
              代码检索
            </a>
          </el-col>
        </div>
        <div style="margin-bottom:300px;">
          <el-col :span="8" class="text-center">
            <a class="pan-btn yellow-btn" href="http://confluence.eswin.com" target="_blank">
              Confluence
            </a>
          </el-col>
          <el-col :span="8" class="text-center">
            <a class="pan-btn tiffany-btn" href="http://10.12.130.2/source" target="_blank">
              文件服务
            </a>
          </el-col>
          <el-col :span="8" class="text-center">
            <a class="pan-btn green-btn" href="https://10.12.130.2" target="_blank">
              云下载
            </a>
          </el-col>
        </div>
        <div style="margin-bottom:400px;">
          <el-col :span="8" class="text-center">
            <a class="pan-btn tiffany-btn" href="http://cri-gitlab.eswin.cn" target="_blank">
              个人代码托管
            </a>
          </el-col>
          <el-col :span="8" class="text-center">
            <a class="pan-btn red-btn" href="http://10.12.130.2:9000/" target="_blank">
              测试平台
            </a>
          </el-col>
          <el-col :span="8" class="text-center">
            <a class="pan-btn light-blue-btn" href="" target="_blank">
              其他……
            </a>
          </el-col>
        </div>
        <div style="margin-bottom:100px;">
          <el-col :span="4" class="text-center"><br><br><br><br><br><br><br><br><br><br><br><br>
          </el-col>
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
</style>
