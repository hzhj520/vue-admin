<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div class="box-container">
          <ul>
            <li v-for="(item, index) in articleList" :key="index">
              <a class="link-btn" :href="item.href" target="_black">
                <!-- <img src="../../assets/url/Jenkins.png" alt=""> -->
                <img :src="item.src" alt="">
                <span>{{ item.title }}</span>
                <!-- <span>{{ img_base_path }}</span> -->
              </a>
            </li>

          </ul>
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
      img_base_path: "../../assets/url/",
      demo: {
        title: ''
      },
      demoRules: {
        title: [{ required: true, trigger: 'change', validator: validate }]
      },
      articleList: [
        { title: '代码评审', href: 'http://gerrit.eswin.cn', src: require("../../assets/url/Gerrit.png") },
        { title: '版本构建', href: 'http://10.100.130.52:8080', src: require("../../assets/url/Jenkins.png") },
        { title: 'OA系统', href: 'https://oa.eswin.com', src: require("../../assets/url/OA.png") },
        { title: '邮件系统', href: 'http://mail.eswin.com', src: require("../../assets/url/Email.png") },
        { title: 'JIRA系统', href: 'http://jira.eswin.com', src: require("../../assets/url/Jira.png") },
        // { title: '代码检索', href: 'http://10.12.130.2:8080/source' },
        // { title: '代码检索', href: 'http://10.12.130.2:8080/source' }
      ]
    }
  }
}
</script>

<style scoped>
.box-card {
  padding: 50px 0
}

.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}

.component-item {
  min-height: 100px;
}

.box-container li {
  list-style: none;
  float: left;
  width: 33%;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-container li a {
  padding: 30px;
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
}

.link-btn img {
  width: 60px;
  border-radius: 100%;
  margin-bottom: 20px;
}

.link-btn span {
  font-size: 20px;
}

.hidden {
  visibility: hidden;
}
</style>
