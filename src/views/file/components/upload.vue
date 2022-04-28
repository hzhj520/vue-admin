<template>
  <div class="app-container" style="width:70%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="系统平台" prop="platform">
        <!-- <el-select v-model="ruleForm.platform" placeholder="请选择系统平台">
          <el-option label="Windows" value="shanghai"></el-option>
          <el-option label="CentOS" value="beijing"></el-option>
          <el-option label="Ubuntu" value="beijing"></el-option>
        </el-select> -->
        <el-radio v-model="radio" label="Windows">Windows</el-radio>
        <el-radio v-model="radio" label="CentOS">CentOS</el-radio>
        <el-radio v-model="radio" label="Ubuntu">Ubuntu</el-radio>
      </el-form-item>
      <el-form-item v-for="(item,index) in ruleForm.testList" :key=index label="上传安装包" inline="true">
        <el-row>
          <el-upload class="upload-demo" drag action="" :http-request="uploadMethod" :limit="1" :on-success="onSuccess" :file-list="fileList" style="align=right">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <el-progress style="margin-top: 8px" :percentage="progressPercent" />
          </el-upload>
          <!-- <el-upload class="upload-demo" action="" :http-request="uploadMethod" :limit="1" :on-success="onSuccess" :file-list="fileList">
            <el-button size="small" type="primary">上传到服务器</el-button>
            <el-progress style="width: 200px;margin-top: 8px" :percentage="progressPercent" />
          </el-upload> -->
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="closeDiagle()" align="center">关闭窗口</el-button>
        <!-- <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button> 
        <el-button @click="resetForm('ruleForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { writeFileDetail, uploadFile } from "@/api/upload";
// import { methods } from 'vue-prismjs';

export default {
  name: 'Upload',
  props: {
    fileInfo: {
      type: Object,
      default: ''
    }
  },
  data() {
    return {
      progressPercent: 0, // 进度条默认为0
      radio: 'Ubuntu',
      dataObj: { token: '', key: '' },
      fileList: [],
      ruleForm: {
        platform: '',
        testList: [{ "platform": 'Windows', "filepath": "" },]
      },
      rules: {
        name: [
          { required: true, message: '请输入软件标题', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    console.log("子组件初始化")
  },
  methods: {
    closeDiagle() {
      console.log("fileInfo------>", this.fileInfo)
      //func: 是父组件指定的传数据绑定的函数，this.msg:子组件给父组件传递的数据
      this.$emit('func')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //上传文件成功后
    onSuccess(response, file, fileList) {
      console.log('----onSuccess----', response, file, fileList)
      this.$message.success('导入成功')
      this.loading = false
      this.fileList = [] //清空文件显示列表
      this.$emit('update:visible', false) //关闭文件选择的弹窗
      this.$emit('upload-success')//触发父组件中方法刷新列表数据
    },
    /**
     * 自定义上传图片的方法
     */
    uploadMethod(params) {
      // 上传新文件时，将进度条值置为零
      this.progressPercent = 0
      // console.log("params----->", params)

      const file = params.file
      this.forms = new FormData() // 实例化一个formData，用来做文件上传
      this.forms.append('file', file)
      this.forms.append('name', this.fileInfo.name)
      this.forms.append('version', this.fileInfo.version)
      // 将图片单独上传，并返回路径
      // 进度条
      const uploadProgressEvent = progressEvent => {
        this.progressPercent = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
      }

      // 调用axios包装后的上传请求方法
      uploadFile(this.forms, uploadProgressEvent).then(res => {
        if (res.code === 20000) {
          // alert(this.radio, "平台安装包上传成功！")
          var file_path = res.data.items
          var file_detail = { file_id: this.fileInfo.id, platform: this.radio, filepath: file_path }
          console.log(file_path)
          writeFileDetail(file_detail).then(res => {
            alert(this.radio + "文件上传成功，将文件信息写入成功！")
            console.log(res.data.items)
          })
          //TODO 调用成功方法
        } else {
          //TODO 调用失败方法
        }
      }).catch(response => {
        console.log('文件上传失败')
      })
    },
  }
}

</script>