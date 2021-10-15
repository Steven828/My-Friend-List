const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/"
const users = []
let filterusers = []
const user_per_page = 24

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")



axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results)
  renderPaginator(users.length)
  renderUserList(getUsersPerPage(1))
})

// render user list
function renderUserList(data) {
  let html = ''
  data.forEach((item) => {
    html += `<div class="col-sm-3">
    <div class="my-3">
      <div class="card text-center">
        <img src="${item.avatar}" class="card-img-top" alt="user-image" data-toggle="modal" data-target="#user-info" data-id="${item.id}">
        <div class="card-body">
          <h5 class="card-title">${item.name} ${item.surname}</h5>
          <button class="btn btn-info btn-add-favorite row justify-content-md-center" data-id="${item.id}">Like</button>
        </div>
      </div>
    </div>
  </div>
    `
    dataPanel.innerHTML = html
  })
}

// render user modal
function showUserModal(id) {
  const modalTitle = document.querySelector("#modal-title")
  const modalbody = document.querySelector(".modal-body")

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    modalTitle.innerText = `${data.name} ${data.surname}`
    modalbody.innerHTML = `
      <p class="modal-gender">gender：${data.gender}</p>
      <p class="modal-age">age：${data.age}</p>
      <p class="modal-region">region：${data.region}</p>
      <p class="modal-birthday">birthday：${data.birthday}</p>
      <p class="modal-email">email：${data.email}</p>
    `
  })
}
//render分頁器
function renderPaginator(amount) {
  const pages = Math.ceil(amount / user_per_page)
  let rawHTML = ''
  for (let page = 1; page <= pages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getUsersPerPage (page) {
  const data = filterusers.length ? filterusers : users
  const startIndex = (page - 1) * user_per_page
  return data.slice(startIndex, startIndex + user_per_page)
}

//新增favorite
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUsers")) || []
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此好友資料已加入收藏')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

//img監聽器
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches('.card-img-top')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// search監聽器
searchForm.addEventListener('keyup', onSubmit)

searchForm.addEventListener('submit', onSubmit)

function onSubmit(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filterusers = users.filter((user) => user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword))
  if (filterusers.length === 0) {
    searchInput.value = ''
    return alert(`找不到 ${keyword} 的資料`)
  }
  renderPaginator(filterusers.length)
  renderUserList(getUsersPerPage(1))
}


// 分頁器監聽器
paginator.addEventListener('click', function paginationClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersPerPage(page))
})