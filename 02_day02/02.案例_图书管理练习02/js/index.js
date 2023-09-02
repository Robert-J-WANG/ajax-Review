/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */

const creator = "laozhang";
// 1.1 获取数据
// 封装函数，用于渲染数据
function getBookList() {
  axios({
    url: "http://hmajax.itheima.net/api/books",
    params: { creator },
  })
    .then((result) => {
      // console.log(result.data.data);
      const bookObj = result.data.data;
      // console.log(bookObj);

      const htmlStr = bookObj
        .map((item, index) => {
          const { id, bookname, author, publisher } = item;
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
    })
    .catch((error) => {
      console.log(error);
    });
}

// 1.2 渲染数据
// 页面初次加载时，调用1次
getBookList();

/**
 * 目标2：新增图书列表
 *  2.1 弹框的显示和隐藏
 *  2.1 提交数据到服务器
 *  2.3 渲染数据
 */

const addDOM = document.querySelector(".add-modal");
const addModal = new bootstrap.Modal(addDOM);
document.querySelector(".add-btn").addEventListener("click", () => {
  // 获取表单数据
  const addForm = document.querySelector(".add-form");
  const bookObj = serialize(addForm, { hash: true, empty: true });
  // console.log(bookObj);
  // 2.1 提交数据到服务器
  axios({
    url: "http://hmajax.itheima.net/api/books",
    method: "POST",
    data: { ...bookObj, creator },
  })
    .then((result) => {
      // console.log(result);
      // 2.3 渲染数据
      getBookList();
      // 隐藏弹框
      addModal.hide();
    })
    .catch((error) => {
      console.log(error);
    });
});

/**
 * 目标 3：删除图书列表
 *  3.1 获取当前书删除元素的ID
 *  3.2 服务器中删除数据
 *  3.3 渲染数据
 */

// 3.1 获取当前书删除元素的ID,事件委托
document.querySelector(".list").addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    // 元素的ID
    const theId = e.target.parentNode.dataset.id;
    // console.log(theId);
    // 3.1 服务器中删除数据
    axios({
      url: ` http://hmajax.itheima.net/api/books/${theId}`,
      method: "DELETE",
    })
      .then((res) => {
        // 3.3 渲染数据
        getBookList();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

/**
 * 目标4：修改图书列表
 *  4.1 弹框的显示和隐藏
 *  4.2 服务器数据的回显
 *  4.3 表单数据的收集
 *  4.4 服务器数据的更新
 *  4.2 渲染数据
 */

// 4.1 弹框的显示和隐藏
const editDOM = document.querySelector(".edit-modal");
const editModal = new bootstrap.Modal(editDOM);
let theId = 0;
document.querySelector(".list").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    // 弹框的显示
    editModal.show();

    // 4.2 服务器数据的回显
    // 元素的ID
    theId = e.target.parentNode.dataset.id;
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
    })
      .then((res) => {
        // console.log(res.data.data);
        const bookObj = res.data.data;
        const list = Object.keys(bookObj);
        // console.log(list);
        list.map((item) => {
          document.querySelector(`.edit-form .${item}`).value = bookObj[item];
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

document.querySelector(".edit-btn").addEventListener("click", () => {
  // 4.3 表单数据的收集
  const editForm = document.querySelector(".edit-form");
  const bookObj = serialize(editForm, { hash: true, empty: true });
  // 4.4 服务器数据的更新
  axios({
    url: `http://hmajax.itheima.net/api/books/${theId}`,
    method: "PUT",
    data: {
      ...bookObj,
      creator,
    },
  })
    .then((res) => {
      // 4.2 渲染数据
      getBookList();
      // 弹框的隐藏
      editModal.hide();
    })
    .catch((err) => {
      console.log(err);
    });
});
