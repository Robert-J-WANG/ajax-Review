/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */

async function getChannelList() {
  // 1.1 获取频道列表数据
  const result = await axios({
    url: "/v1_0/channels",
  });
  // console.log(result);
  const htmlStr = result.data.channels
    .map((item) => {
      return `<option value="${item.id}">${item.name}</option>`;
    })
    .join("");
  // console.log(htmlStr);
  // 1.2 展示到下拉菜单中
  document.querySelector(".form-select").innerHTML =
    '<option value="" selected="">请选择文章频道</option>' + htmlStr;
}
// 页面初次加载，调用一次函数
getChannelList();
/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
// 注册事件
document.querySelector(".img-file").addEventListener("change", async (e) => {
  // 2.2 选择文件并保存在 FormData
  const file = e.target.files[0];
  const fd = new FormData();
  fd.append("image", file);
  // 2.3 单独上传图片并得到图片 URL 网址
  const result = await axios({
    url: "/v1_0/upload",
    method: "POST",
    data: fd,
  });
  // console.log(result);
  const imgUrl = result.data.url;
  // 2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
  document.querySelector(".rounded").src = imgUrl;
  document.querySelector(".rounded").classList.add("show");
  document.querySelector(".place").classList.add("hide");
});
// 点击图片，更换图片
document.querySelector(".rounded").addEventListener("click", () => {
  document.querySelector(".img-file").click();
});

/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */
// 注册事件
document.querySelector(".send").addEventListener("click", async () => {
  try {
    // 3.1 基于 form-serialize 插件收集表单数据对象
    const form = document.querySelector(".art-form");
    const data = serialize(form, { hash: true, empty: true });
    // console.log(data);
    // 重新组织获取的数据
    delete data.id;
    data.cover = {
      type: 1,
      image: [document.querySelector(".rounded").src],
    };
    // console.log(data);

    // 3.2 基于 axios 提交到服务器保存
    const result = await axios({
      url: "/v1_0/mp/articles",
      method: "POST",
      data: data,
    });
    // console.log(result);
    // 3.3 调用 Alert 警告框反馈结果给用户
    myAlert(true, "发布成功 " + result.message);
    // 重置表单内容
    form.reset();
    // 重置图片设置
    document.querySelector(".rounded").src = "";
    document.querySelector(".rounded").classList.remove("show");
    document.querySelector(".place").classList.remove("hide");
    // 重置富文本设置
    editor.setHtml("");
    // 跳转页面
    setTimeout(() => {
      location.href = "../content/index.html";
    }, 1500);
  } catch (err) {
    // console.dir(err);
    // 3.3 调用 Alert 警告框反馈结果给用户
    myAlert(false, err.response.data.message);
  }
});
/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */

/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
