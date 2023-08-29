/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */

const creator = "laowang";
// 封装渲染函数
function getBooklists() {
  // 1.1 获取数据
  axios({
    url: "http://hmajax.itheima.net/api/books",
    params: { creator },
  }).then((res) => {
    // console.log(res);
    const booklists = res.data.data;
    console.log(booklists);
    // 1.2 渲染数据 数组映射map
    const htmlStr = booklists
      .map((item, index) => {
        return `
      <tr>
          <td>${index + 1}</td>
          <td>${item.bookname}</td>
          <td>${item.author}</td>
          <td>${item.publisher}</td>
          <td>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>
      `;
      })
      .join("");

    document.querySelector(".list").innerHTML = htmlStr;
  });
}

// 页面初次加载，渲染数据creator
getBooklists();
