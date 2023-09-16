/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */

// 1.2 收集手机号和验证码数据
document.querySelector(".btn").addEventListener("click", () => {
  // 收集表单数据
  const loginForm = document.querySelector(".login-form");
  const data = serialize(loginForm, { hash: true, empty: true });
  // console.log(data);
  // 1.3 基于 axios 调用验证码登录接口
  axios({
    url: "/v1_0/authorizations",
    method: "POST",
    data,
  })
    .then((res) => {
      console.log(res);
      // 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
      myAlert(true, "验证成功");

      // 保存token到本地，用于页面跳转
      localStorage.setItem("token", res.data.token);
      // 跳转页面
      setTimeout(() => {
        location.href = "../content/index.html";
      }, 1500);
    })
    .catch((err) => {
      // console.dir(err);
      // 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
      myAlert(false, err.response.data.message);
    });
});
