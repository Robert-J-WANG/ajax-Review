/**
 * 目标1：完成省市区下拉列表切换
 *  1.1 设置省份下拉菜单数据
 *  1.2 切换省份，设置城市下拉菜单数据，清空地区下拉菜单
 *  1.3 切换城市，设置地区下拉菜单数据
 */

// 1.1 设置省份下拉菜单数据
axios({ url: "http://hmajax.itheima.net/api/province" }).then((res) => {
  // console.log(res);
  const pHtmlStr = res.data.list
    .map((item) => {
      return `<option value="${item}">${item}</option>`;
    })
    .join("");
  // console.log(pHtmlStr);
  document.querySelector(".province").innerHTML =
    '<option value="">省份</option>' + pHtmlStr;
});

// 1.2 切换省份，设置城市下拉菜单数据，清空地区下拉菜单
document.querySelector(".province").addEventListener("change", async (e) => {
  // console.log(e.target.value);
  const cPromise = await axios({
    url: "http://hmajax.itheima.net/api/city",
    params: { pname: e.target.value },
  });
  // console.log(cPromise);
  const cList = cPromise.data.list;
  const cHtmlStr = cList
    .map((item) => {
      return `<option value="${item}">${item}</option>`;
    })
    .join("");
  document.querySelector(".city").innerHTML =
    '<option value="">城市</option>' + cHtmlStr;

  // 清空地区下拉菜单
  document.querySelector(".area").innerHTML = '<option value="">地区</option>';
});

// 1.3 切换城市，设置地区下拉菜单数据
document.querySelector(".city").addEventListener("change", async (e) => {
  // console.log(e.target.value);
  const aPromise = await axios({
    url: "http://hmajax.itheima.net/api/area",
    params: {
      pname: document.querySelector(".province").value,
      cname: e.target.value,
    },
  });
  // console.log(aPromise);
  const aHtmlStr = aPromise.data.list
    .map((item) => {
      return `<option value="${item}">${item}</option>`;
    })
    .join("");
  document.querySelector(".area").innerHTML =
    '<option value="">地区</option>' + aHtmlStr;
});

/**
 * 目标2：提交数据
 *  2.1 注册事件
 *  2.2 收集表单数据，提交到服务器
 *  2.3 显示提交结果信息
 */

// 2.1 注册事件
document.querySelector(".submit").addEventListener("click", async () => {
  try {
    // 2.2 收集表单数据
    const form = document.querySelector(".info-form");
    const formObj = serialize(form, { hash: true, empty: true });
    // console.log(formObj);
    // 提交到服务器
    const result = await axios({
      url: "http://hmajax.itheima.net/api/feedback",
      method: "POST",
      data: formObj,
    });
    // console.log(result);
    // 2.3 显示提交结果信息
    alert(result.data.message);
  } catch (err) {
    // console.dir(err);
    alert(err.response.data.message);
  }
});
