/**
 * 目标1：信息渲染
 *  1.1 获取用户的数据
 *  1.2 回显数据到标签上
 * */

// 1.1 获取用户的数据
const creator = "laoli";
axios({
  url: "http://hmajax.itheima.net/api/settings",
  params: {
    creator,
  },
}).then((res) => {
  // console.log(res.data.data);
  const obj = res.data.data;
  // 1.2 回显数据到标签上
  Object.keys(obj).forEach((key) => {
    if (key === "avatar") {
      document.querySelector(".prew").src = obj[key];
    } else if (key === "gender") {
      const gRadioList = document.querySelectorAll(".gender");
      const gNumber = obj[key];
      gRadioList[gNumber].checked = true;
    } else {
      document.querySelector(`.${key}`).value = obj[key];
    }
  });
});

/**
 * 目标2：修改头像
 *  2.1 获取头像文件
 *  2.2 提交服务器并更新头像
 * */

// 2.1 获取头像文件
document.querySelector(".upload").addEventListener("change", (e) => {
  const fd = new FormData();
  fd.append("avatar", e.target.files[0]);
  fd.append("creator", creator);
  console.log(fd);
  // 2.2 提交服务器并更新头像
  axios({
    url: "http://hmajax.itheima.net/api/avatar",
    method: "PUT",
    data: fd,
  }).then((res) => {
    const imgUrl = res.data.data.avatar;
    document.querySelector(".prew").src = imgUrl;
  });
});

/**
 * 目标3：提交表单
 *  3.1 收集表单信息
 *  3.2 提交到服务器保存
 */

// *  3.1 收集表单信息

document.querySelector(".submit").addEventListener("click", () => {
  const userForm = document.querySelector(".user-form");
  const userObj = serialize(userForm, { hash: true, empty: true });
  // console.log(userObj); // {email: 'itheima@itcast.cn', nickname: 'itheima', gender: '0', desc: '我是laoli'}
  userObj.gender = +userObj.gender;
  userObj.creator = creator;
  //  3.2 提交到服务器保存
  axios({
    url: "http://hmajax.itheima.net/api/settings",
    method: "PUT",
    data: userObj,
  }).then((res) => {
    // console.log(res);
    /**
     * 目标4：结果提示
     *  4.1 创建toast对象
     *  4.2 调用show方法->显示提示框
     */
    // 4.1 创建toast对象
    const toastDOM = document.querySelector(".my-toast");
    const toast = new bootstrap.Toast(toastDOM);

    // 4.2 调用show方法->显示提示框
    toast.show();
  });
});
