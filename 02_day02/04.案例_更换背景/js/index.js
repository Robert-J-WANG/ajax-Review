/**
 * 目标：网站-更换背景
 *  1. 选择图片上传，设置body背景
 *  2. 上传成功时，"保存"图片url网址
 *  3. 网页运行后，"获取"url网址使用
 * */

document.querySelector(".bg-ipt").addEventListener("change", (e) => {
  const df = new FormData();
  df.append("img", e.target.files[0]);
  // 1. 选择图片上传，设置body背景
  axios({
    url: "http://hmajax.itheima.net/api/uploadimg",
    method: "POST",
    data: df,
  }).then((res) => {
    const imgUrl = res.data.data.url;
    // console.log(imgUrl);
    document.body.style.backgroundImage = `url(${imgUrl})`;

    // 2. 上传成功时，"保存"图片url网址
    localStorage.setItem("imgUrl", imgUrl);
  });
});

// 3. 网页运行后，"获取"url网址使用
const imgUrl = localStorage.getItem("imgUrl");
imgUrl && (document.body.style.backgroundImage = `url(${imgUrl})`);
