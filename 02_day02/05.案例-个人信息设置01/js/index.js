/**
 * 目标1：信息渲染
 *  1.1 获取用户的数据
 *  1.2 回显数据到标签上
 * */

const creator = "lao";

axios({
  url: "http://hmajax.itheima.net/api/settings",
  params: { creator },
}).then((res) => {
  // console.log(res.data.data);
  const userData = res.data.data;

  const keys = Object.keys(userData);
  keys.forEach((key) => {
    if (key === "avatar") {
      document.querySelector(".prew").src = userData[key];
    } else if (key === "gender") {
      document.querySelectorAll(".gender")[userData[key]].checked = true;
    } else {
      document.querySelector(`[name=${key}]`).value = userData[key];
    }
  });
});

// 更新头像
document.querySelector(".upload").addEventListener("change", (e) => {
  const fd = new FormData();
  fd.append("avatar", e.target.files[0]);
  fd.append("creator", creator);
  axios({
    url: "http://hmajax.itheima.net/api/avatar",
    method: "PUT",
    data: fd,
  }).then((res) => {
    const imgUrl = res.data.data.url;
    document.querySelector(".prew").src = imgUrl;
  });
});

// 更新表单内容
document.querySelector(".user-form").addEventListener("submit", (e) => {
  // console.log(111);
  const userObj = serialize(e.target, { hash: true, empty: true });
  // console.log(uerObj);
  userObj.gender = +userObj.gender;
  axios({
    url: "http://hmajax.itheima.net/api/settings",
    method: "PUT",
    data: { ...userObj, creator },
  }).then((res) => {
    // console.log(res);
    const toastDOM = document.querySelector(".toast");
    const toast = new bootstrap.Toast(toastDOM);
    document.querySelector(".info-box").innerHTML = res.data.message;
    toast.show();
  });
});
