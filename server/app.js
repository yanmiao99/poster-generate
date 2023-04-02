const express = require('express')
const PORT = 3001
const uploader = require('express-fileupload') // 解析文件上传
const cors = require('cors') // 解决跨域
const app = express()
const tencentcloud = require("tencentcloud-sdk-nodejs-bda");
const BdaClient = tencentcloud.bda.v20200324.Client;
const clientConfig = {
  credential: {
    // 这个是腾讯云的
    secretId: "AKIDkK3ZfU4MN7fwwe5F8k5AyVmoZ3GCrFMD",  // 更换成自己的 id
    secretKey: "dz4tSklW0D9nBI8hz1mGUR8YAWcRzGMB",     // 更换成自己的 key
  },
  region: "ap-beijing",
  profile: {
    httpProfile: {
      endpoint: "bda.tencentcloudapi.com",
    },
  },
};

app.use(express.json()) // 解析 json 数据
app.use(express.urlencoded({extended: false})) // 解析 x-www-form-urlencoded 数据
app.use(cors()) //  解决跨域
app.use(uploader()) // 解析文件上传

app.post('/upload_img', (req, res) => {
  const {file} = req.files

  if (!file) {
    return res.send({
      code: 400,
      msg: '文件不能为空',
      data: null
    })
  }
  const buffer2Base64 = Buffer.from(file.data).toString('base64');
  const client = new BdaClient(clientConfig);
  const params = {
    "Image": buffer2Base64,
    "RspImgType": "base64"
  };
  client.SegmentPortraitPic(params).then(
    (data) => {
      res.send({
        code: 200,
        msg: '上传成功',
        data
      })
    },
    (err) => {
      console.error("error", err);
    }
  );
})

app.listen(PORT, () => {
  console.log(`端口启动在 ${PORT}`)
})
