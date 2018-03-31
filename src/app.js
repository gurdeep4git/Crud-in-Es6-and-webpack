import {http} from "./http";
import{ui} from "./ui";


const url ="http://localhost:3000/posts";


document.addEventListener("DOMContentLoaded",getPosts);
document.querySelector(".post-submit").addEventListener("click",submitPost);
document.querySelector('#posts').addEventListener('click', deletePost);
document.querySelector('#posts').addEventListener('click', enableEdit);
document.querySelector('.card-form').addEventListener('click', cancelEdit);


function getPosts(){
    http.get(url)
        .then(data=>{
           ui.showPosts(data);
        })
        .catch(error=>console.log(error));
}

function submitPost(){
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const id = document.querySelector('#id').value;
    
    const data = {
        title,
        body
    }

    if(title === '' || body === '') {
        ui.showAlert('Please fill in all fields', 'alert alert-danger');
    }
    else{
        if(id === '') {
            // Create Post
            http.post(url, data)
            .then(data => {
              ui.showAlert('Post added', 'alert alert-success');
              ui.clearFields();
              getPosts();
            })
            .catch(err => console.log(err));
          } 
          else {
            // Update Post
            http.put(url+`/${id}`, data)
            .then(data => {
              ui.showAlert('Post updated', 'alert alert-success');
              ui.changeFormState('add');
              getPosts();
            })
            .catch(err => console.log(err));
        }
    } 
}

function deletePost(e) {
    if(e.target.parentElement.classList.contains('delete')) {
      const id = e.target.parentElement.dataset.id;
      if(confirm('Are you sure?')) {
        http.delete(url+`/${id}`)
          .then(data => {
            ui.showAlert('Post removed', 'alert alert-success');
            getPosts();
          })
          .catch(err => console.log(err));
      }
    }
    e.preventDefault();
}

function enableEdit(e) {
    if(e.target.parentElement.classList.contains('edit')) {
      const id = e.target.parentElement.dataset.id;
      const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
      const body = e.target.parentElement.previousElementSibling.textContent;
      
      const data = {
        id,
        title,
        body
      }
  
      // Fill form with current post
      ui.fillForm(data);
    }
    
    e.preventDefault();
}

// Cancel Edit State
function cancelEdit(e) {
    if(e.target.classList.contains('post-cancel')) {
      ui.changeFormState('add');
    }
  
    e.preventDefault();
  }

