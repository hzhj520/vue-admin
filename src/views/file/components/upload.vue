<template>
  <div class="app-container" style="width: 70%">
    <el-dialog :visible.sync="dialogUploadVisible" title="上传软件包" width="40%" @open="clearFiles">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="系统平台" prop="platform">
          <el-radio v-model="radio" label="Windows" @change="clearFiles">Windows</el-radio>
          <el-radio v-model="radio" label="CentOS" @change="clearFiles">CentOS</el-radio>
          <el-radio v-model="radio" label="Ubuntu" @change="clearFiles">Ubuntu</el-radio>
          <el-radio v-model="radio" label="Manual" @change="clearFiles">用户手册</el-radio>
        </el-form-item>
        <el-form-item v-for="(item, index) in ruleForm.testList" :key="index" label="上传安装包" inline="true">
          <el-row>
            <!-- <el-upload class="upload-demo" drag action="" :http-request="uploadMethod" :limit="1"
              :on-success="onSuccess" :file-list="fileList" style="align=right" ref="myUpload">
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <el-progress style="margin-top: 8px" :percentage="progressPercent" />
            </el-upload> -->
            <!-- <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS">将文件拖到此处，或点击上传</vue-dropzone> -->
            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" @vdropzone-sending="sendingEvent"
              @vdropzone-removed-file="dropzoneR" @vdropzone-success="dropzoneS" @vdropzone-error="dropzoneE">
            </vue-dropzone>
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
import { uploadFile } from "@/api/upload";

import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  name: "Upload",
  components: {
    vueDropzone: vue2Dropzone,
  },
  props: {
    fileInfo: {
      type: Object,
      default: undefined,
    },
    dialogUploadShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      progressPercent: 0, // 进度条默认为0
      radio: "Manual",
      dataObj: { token: "", key: "" },
      fileList: [],
      ruleForm: {
        platform: "",
        testList: [{ platform: "Windows", filepath: "" }],
      },
      dialogUploadVisible: false,
      rules: {
        name: [
          { required: true, message: "请输入软件标题", trigger: "blur" },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      dropzoneOptions: {
        url: "/dev-api/file/upload2",
        paramName: "file",
        chunking: true,
        forceChunking: true,
        thumbnailWidth: 150,
        parallelUploads: 100,  //手动触发时一次最大可以上传多少个文件
        maxFiles: 1,  //一次上传的量
        maxFilesize: 1024 * 1024 * 10000, // megabytes
        chunkSize: 1024 * 1024 * 50, // bytes
        addRemoveLinks: true,
        headers: { "My-Awesome-Header": "header value" },
        dictDefaultMessage: "拖入需要上传的文件",      //上传框默认显示文字
        dictMaxFilesExceeded: "您最多只能上传10个文件！",
        dictResponseError: '文件上传失败!',
        dictInvalidFileType: "你不能上传该类型文件,文件类型只能是*.jpg,*.gif,*.png。",
        dictFallbackMessage: "浏览器不受支持",
        dictFileTooBig: "文件过大上传文件最大支持.",

      },
    };
  },
  watch: {
    dialogUploadShow(newVal) {
      // console.log("watch方法生效了", newVal)
      this.dialogUploadVisible = true;
    },
  },
  methods: {
    test() {
      alert("进入了点击事件");
    },
    sendingEvent(file, xhr, formData) {
      formData.append("name", this.fileInfo.name);
      formData.append("version", this.fileInfo.version);
      formData.append("file_id", this.fileInfo.id);
      formData.append("platform", this.radio);
      // console.log("@formData------>", formData)
      // console.log("@file------>", file)
      // console.log("@xhr------>", xhr)
    },
    dropzoneS(file) {
      console.log(file)
      this.$notify({
        title: "Success",
        message: this.radio + "平台文件上传成功，将文件信息写入成功！",
        type: "success",
      });
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    },
    dropzoneE(file) {
      console.log(file)
      this.$notify.error({
        title: "失败",
        message: this.radio + "平台文件上传失败，原因如下：" + file.xhr.response,
        duration: 0,
      });
    },
    closeDiagle() {
      // console.log("fileInfo------>", this.fileInfo)
      this.dialogUploadVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //上传文件成功后
    onSuccess(response, file, fileList) {
      console.log("----onSuccess----", response, file, fileList);
      this.$message.success("导入成功");
      this.loading = false;
      this.fileList = []; //清空文件显示列表
      this.$emit("update:visible", false); //关闭文件选择的弹窗
      this.$emit("upload-success"); //触发父组件中方法刷新列表数据
    },
    /**
     * 自定义上传图片的方法
     */
    uploadMethod(params) {
      // 上传新文件时，将进度条值置为零
      this.progressPercent = 0;
      // console.log("params----->", params)

      const file = params.file;
      this.forms = new FormData(); // 实例化一个formData，用来做文件上传
      this.forms.append("file", file);
      this.forms.append("name", this.fileInfo.name);
      this.forms.append("version", this.fileInfo.version);
      this.forms.append("file_id", this.fileInfo.id);
      this.forms.append("platform", this.radio);

      // console.log("fileInfo.id---------->", this.fileInfo.id)
      // 将图片单独上传，并返回路径
      // 进度条
      const uploadProgressEvent = (progressEvent) => {
        this.progressPercent = Math.floor(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      };

      // 调用axios包装后的上传请求方法
      uploadFile(this.forms, uploadProgressEvent)
        .then((res) => {
          if (res.code === 20000) {
            var file_detail = res.data.items;
            console.log(file_detail);
            // var file_detail = {
            //   file_id: this.fileInfo.id,
            //   platform: this.radio,
            //   filepath: file_path,
            // };
            // alert("文件传输完成");
            // writeFileDetail(file_detail).then((res) => {
            // console.log(res.data.items)
            this.$notify({
              title: "Success",
              message: this.radio + "平台文件上传成功，将文件信息写入成功！",
              type: "success",
            });
            // });
            //TODO 调用成功方法
          } else {
            //TODO 调用失败方法
          }
        })
        .catch((response) => {
          this.$notify.error({
            title: "失败",
            message: this.radio + "平台文件上传失败，写入文件信息失败！",
            duration: 0,
          });
        });
    },
    clearFiles() {
      // console.log("进入clearFiles方法")
      setTimeout(() => {
        this.$refs.myVueDropzone[0].removeAllFiles()
        // this.$refs["myUpload"][0].clearFiles();
        this.progressPercent = 0;
      }, 0);
    },
    getFileDetail() {
      this.$emit("getFileDetail", this.fileInfo); // 调用父组件的fatherFnTwo方法
    },
  },
};
</script>
