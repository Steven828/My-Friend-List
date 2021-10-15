const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/"
const users = JSON.parse(localStorage.getItem('favoriteUsers')) || []

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")


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

// render user list
function renderUserList(data) {
  let html = ''
  data.forEach((item) => {
    html += `<div class="col-sm-2">
    <div class="my-2 mx-2">
      <div class="card text-center">
        <img src="${item.avatar}" class="card-img-top" alt="user-image" data-toggle="modal" data-target="#user-info" data-id="${item.id}">
        <div class="card-body">
          <h5 class="card-title">${item.name} ${item.surname}</h5>
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>
    `
  })
  dataPanel.innerHTML = html
}
//img監聽器
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches('.card-img-top')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})
// search監聽器
searchForm.addEventListener('keyup', function onSubmit(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filterusers = users.filter((user) => user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword))
  if (filterusers.length === 0) {
    searchInput.value = ''
    return alert(`找不到 ${keyword} 的資料`)
  }
  renderUserList(filterusers)
})

//刪除favorite
function removeFromFavorite(id) {
  if (!users) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}
renderUserList(users)
