/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
// 1.1 准备查询参数对象
const qObj = {
  status: "",
  channel_id: "",
  page: 1,
  per_page: 3,
};
let totalPage = 0;
// 1.2 获取文章列表数据
async function setArtileList() {
  const reslt = await axios({
    url: "/v1_0/mp/articles",
    params: qObj,
  });
  // console.log(reslt);
  const htmlStr = reslt.data.results
    .map((item) => {
      // console.log(item);
      return `
    <tr>
      <td>
      <img src=${
        item.cover.type === 0
          ? "https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500"
          : item.cover.images[0]
      } alt="">
      </td>
      <td>${item.title}</td>
      <td>
      ${
        item.title === 1
          ? '<span class="badge text-bg-primary">待审核</span>'
          : '<span class="badge text-bg-success">审核通过</span>'
      }
      </td>
      <td>
        <span>${item.pubdate}</span>
      </td>
      <td>
        <span>${item.read_count}</span>
      </td>
      <td>
        <span>${item.comment_count}</span>
      </td>
      <td>
        <span>${item.like_count}</span>
      </td>
      <td data-id=${item.id}>
        <i class="bi bi-pencil-square edit"></i>
        <i class="bi bi-trash3 del"></i>
      </td>
    </tr>
    `;
    })
    .join("");
  // console.log(htmlStr);
  document.querySelector(".art-list").innerHTML = htmlStr;
  // 3.1 保存并设置文章总条数
  totalPage = reslt.data.total_count;
  document.querySelector(".total-count").innerHTML = `共${totalPage}条`;
  document.querySelector(".page-now").innerHTML = `第${qObj.page}页`;
}
setArtileList();

/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */

// *  2.1 设置频道列表数据
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
// 2.2 监听筛选条件改变，保存查询信息到查询参数对象
// 获取审核状态
document.querySelectorAll(".form-check-input").forEach((item) =>
  item.addEventListener("change", (e) => {
    qObj.status = e.target.value;
  })
);
// 获取频道ID
document.querySelector(".form-select").addEventListener("change", (e) => {
  // console.log(e.target.value);
  qObj.channel_id = e.target.value;
});

// 2.3 点击筛选时，传递查询参数对象到服务器
document.querySelector(".sel-btn").addEventListener("click", () => {
  // 2.4 获取匹配数据，覆盖到页面展示
  setArtileList();
});
/**
 *
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */

// 3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
document.querySelector(".next").addEventListener("click", () => {
  // 做临界值判断
  if (qObj.page < Math.ceil(totalPage / qObj.per_page)) {
    qObj.page++;
  }
  // 并切换页码参数并请求最新数据
  setArtileList();
});

// 3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
document.querySelector(".last").addEventListener("click", () => {
  // 做临界值判断
  if (qObj.page > 1) {
    qObj.page--;
  }
  // 并切换页码参数并请求最新数据
  setArtileList();
});

/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */

document.querySelector(".art-list").addEventListener("click", async (e) => {
  if (e.target.classList.contains("del")) {
    // console.log(11);
    // 4.2 点击删除时，获取文章 id
    const theId = e.target.parentNode.dataset.id;
    // console.log(theId);
    // 4.3 调用删除接口，传递文章 id 到服务器
    const result = await axios({
      url: `/v1_0/mp/articles/${theId}`,
      method: "DELETE",
    });
    // console.log(result);
  }
  // 4.5 删除最后一页的最后一条，需要自动向前翻页
  const children = document.querySelector(".art-list").children;
  if (children.length === 1 && qObj.page !== 1) {
    qObj.page--;
  }
  // 4.4 重新获取文章列表，并覆盖展示
  setArtileList();
});

// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
document.querySelector(".art-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    // console.log(11);
    const theId = e.target.parentNode.dataset.id;
    location.href = `../publish/index.html?id=${theId}`;
  }
});
