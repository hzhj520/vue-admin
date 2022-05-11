<template>
  <div class="app-container" style="width:70%">
    <el-dialog :visible.sync="dialogUploadVisible" title="上传软件包" width="40%" @open="clearFiles">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="系统平台" prop="platform">
          <!-- <el-select v-model="ruleForm.platform" placeholder="请选择系统平台">
          <el-option label="Windows" value="shanghai"></el-option>
          <el-option label="CentOS" value="beijing"></el-option>
          <el-option label="Ubuntu" value="beijing"></el-option>
        </el-select> -->
          <el-radio v-model="radio" label="Windows" @change="clearFiles">Windows</el-radio>
          <el-radio v-model="radio" label="CentOS" @change="clearFiles">CentOS</el-radio>
          <el-radio v-model="radio" label="Ubuntu" @change="clearFiles">Ubuntu</el-radio>
          <el-radio v-model="radio" label="Manual" @change="clearFiles">用户手册</el-radio>
        </el-form-item>
        <el-form-item v-for="(item,index) in ruleForm.testList" :key=index label="上传安装包" inline="true">
          <el-row>
            <el-upload class="upload-demo" drag action="" :http-request="uploadMethod" :limit="1" :on-success="onSuccess" :file-list="fileList" style="align=right" ref="myUpload">
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
          <el-button type="primary" @click="getFileDetail()" align="center">查看文件列表</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
    },
    dialogUploadShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      progressPercent: 0, // 进度条默认为0
      radio: 'Manual',
      dataObj: { token: '', key: '' },
      fileList: [],
      ruleForm: {
        platform: '',
        testList: [{ "platform": 'Windows', "filepath": "" },]
      },
      dialogUploadVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入软件标题', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
    dialogUploadShow(newVal) {
      // console.log("watch方法生效了", newVal)
      this.dialogUploadVisible = true
    }
  },
  methods: {
    test() {
      alert("进入了点击事件")
    },
    closeDiagle() {
      // console.log("fileInfo------>", this.fileInfo)
      this.dialogUploadVisible = false
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

      // console.log("fileInfo.id---------->", this.fileInfo.id)
      // 将图片单独上传，并返回路径
      // 进度条
      const uploadProgressEvent = progressEvent => {
        this.progressPercent = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
      }

      // 调用axios包装后的上传请求方法
      uploadFile(this.forms, uploadProgressEvent).then(res => {
        if (res.code === 20000) {
          var file_path = res.data.items
          var file_detail = { file_id: this.fileInfo.id, platform: this.radio, filepath: file_path }
          writeFileDetail(file_detail).then(res => {
            // console.log(res.data.items)
            this.$notify({
              title: 'Success',
              message: this.radio + '平台文件上传成功，将文件信息写入成功！',
              type: 'success',
              duration: 3000
            })
          })
          //TODO 调用成功方法
        } else {
          //TODO 调用失败方法
        }
      }).catch(response => {
        console.log('文件上传失败')
      })
    },
    clearFiles() {
      // console.log("进入clearFiles方法")
      setTimeout(() => {
        this.$refs['myUpload'][0].clearFiles()
        this.progressPercent = 0
      }, 0)
    },
    getFileDetail() {
      this.$emit('getFileDetail', this.fileInfo) // 调用父组件的fatherFnTwo方法
    }
  }
}

</script>