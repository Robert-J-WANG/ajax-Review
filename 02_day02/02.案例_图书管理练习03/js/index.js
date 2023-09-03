/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */

const creator = "lao";
function getBooklist() {
  axios({
    url: "http://hmajax.itheima.net/api/books",
    params: {
      creator: creator,
    },
  }).then((res) => {
    // console.log(res.data.data);
    const bookObj = res.data.data;
    const htmlStr = bookObj
      .map((book, index) => {
        const { id, bookname, author, publisher } = book;
        return `
      <tr>
          <td>${index + 1}</td>
          <td>${bookname}</td>
          <td>${author}</td>
          <td>${publisher}</td>
          <td data-id=${id}>
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
getBooklist();

/**
 * 目标2：添加图书列表
 *  2.1 弹框的显示隐藏
 *  2.2 获取表单数据
 *  2.3 添加数据到服务器
 *  2.4 渲染数据
 */

const addDOM = document.querySelector(".add-modal");
const addModal = new bootstrap.Modal(addDOM);
document.querySelector(".add-btn").addEventListener("click", () => {
  const addForm = document.querySelector(".add-form");
  const list = serialize(addForm, { hash: true, empty: true });
  axios({
    url: "http://hmajax.itheima.net/api/books",
    method: "POST",
    data: {
      ...list,
      creator,
    },
  }).then((res) => {
    // console.log(res);
    getBooklist();
    addForm.reset();
    addModal.hide();
  });
});
/**
 * 目标3： 删除图书列表
 *  3.1 获取当前删除元素的ID
 *  3.2 服务器中删除数据
 *  3.3 渲染数据
 */

// 注册事件，事件委托
document.querySelector(".list").addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    // console.log(111);
    const theID = e.target.parentNode.dataset.id;
    // console.log(theID);
    axios({
      url: `http://hmajax.itheima.net/api/books/${theID}`,
      method: "DELETE",
    }).then((res) => {
      // console.log(res);
      getBooklist();
    });
  }
});

/**
 * 目标4： 编辑图书列表
 *  4.1 获取当前编辑元素的ID
 *  4.2 弹窗的显示隐藏
 *  4.3 数据的回显
 *  4.4 收集表单数据
 *  4.5 服务器更新数据
 *  5.5 渲染数据
 */

const editDOM = document.querySelector(".edit-modal");
const editModal = new bootstrap.Modal(editDOM);
document.querySelector(".list").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    editModal.show();
    // console.log(111);
    const theID = e.target.parentNode.dataset.id;
    axios({
      url: `http://hmajax.itheima.net/api/books/${theID}`,
    }).then((res) => {
      // console.log(res.data.data);
      const bookObj = res.data.data;
      const keys = Object.keys(bookObj);
      keys.forEach((key) => {
        document.querySelector(`.edit-form [name=${key}]`).value = bookObj[key];
      });
    });
  }
});

document.querySelector(".edit-btn").addEventListener("click", () => {
  const editForm = document.querySelector(".edit-form");
  const { id, bookname, author, publisher } = serialize(editForm, {
    hash: true,
    empty: true,
  });
  axios({
    url: `http://hmajax.itheima.net/api/books/${id}`,
    method: "PUT",
    data: { id, bookname, author, publisher, creator },
  }).then((res) => {
    getBooklist();
    editModal.hide();
  });
});
