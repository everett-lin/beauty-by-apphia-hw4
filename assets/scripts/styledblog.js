var id = 0;

// Helper function to initialize local storage on first load
export async function init() {
    if(localStorage.getItem('posts') !== null) {
        console.log('Local storage exists!');
    } else {
        // Only populate with default values when there is no local storage
        console.log('Local storage does not exist. Populating with default values...');
        await populate('/assets/scripts/defaultposts.json');
    }
    initBlog();
}

// Populates local storage with default blog posts values
function populate(URL) {
    return new Promise(resolve => {
        fetch(URL)
            .then(response => response.json())
            .then(data => {
                let dataString = JSON.stringify(data);

                localStorage.setItem('posts', dataString);
                resolve();
            });
    });
}

// Read posts from local storage and create HTML
function initBlog() {
    // Note: global scope so we always have access to this array
    let posts = JSON.parse(localStorage.getItem('posts')).posts;

    for (let i = 0; i < posts.length; i++) {
        id++;
        appendPost(posts[i].postTitle, posts[i].postDate, posts[i].postSummary, id);
    };
}

function appendPost(title, date, summary, id) {
    let bs = document.getElementById('blog-section');
    let post = document.createElement('div');

    post.setAttribute('id', `post-${id}`);

    post.innerHTML = `
        <hr>
        <div class="blog-header">
            <h3 id="title-${id}">${title}</h3>
            <svg id="edit-${id}" onclick="edit(${id})" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="24px" height="24px" fill-rule="nonzero"><g fill="#689d6a" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M18.41406,2c-0.25587,0 -0.51203,0.09747 -0.70703,0.29297l-1.70703,1.70703l4,4l1.70703,-1.70703c0.391,-0.391 0.391,-1.02406 0,-1.41406l-2.58594,-2.58594c-0.1955,-0.1955 -0.45116,-0.29297 -0.70703,-0.29297zM14.5,5.5l-11.5,11.5v4h4l11.5,-11.5z"></path></g></g></svg> 
            <svg id="delete-${id}" onclick="remove(${id})" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="24px" height="24px" fill-rule="nonzero"><g fill="#d65d0e" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M10,2l-1,1h-6v2h18v-2h-6l-1,-1zM4.36523,7l1.52734,13.26367c0.132,0.99 0.98442,1.73633 1.98242,1.73633h8.24805c0.998,0 1.85138,-0.74514 1.98438,-1.74414l1.52734,-13.25586z"></path></g></g></svg>
        </div>
        <time id="date-${id}" datetime="${date}" format="MM/DD/YYYY">${date}</time>
        <p id="summary-${id}">${summary}</p>
        <hr>
    `;
    bs.appendChild(post);
}

export function add() {
    let promptDialog = document.createElement('dialog');

    promptDialog.innerHTML = `
        <form id="add-form">
            <label for="post-title">Post Title:</label><br>
            <input type="text" autocomplete="off" id="post-title" name="post-title" placeholder="Intro to CRUD" required><br><br>

            <label for="post-date">Date:</label><br>
            <input type="date" id="post-date" name="post-date" required><br><br>

            <label for="post-summary">Summary:</label><br>
            <textarea id="post-summary" autocomplete="off" style="width: 500px; height:200px"  name="post-summary" placeholder="What does it mean to implement Create, Read, Update, Delete? (CRUD)" required></textarea><br><br>

            <button type="submit" id="closeDialogTrue">OK</button>
            <button id="closeDialogFalse">Cancel</button>
        </form>
    `;

    promptDialog.style.textAlign = 'left';
    document.body.appendChild(promptDialog);
    promptDialog.showModal();

    let ok = document.getElementById('closeDialogTrue');
    ok.addEventListener("click", () => {
        let title = DOMPurify.sanitize(document.getElementById('post-title').value);
        let date = DOMPurify.sanitize(document.getElementById('post-date').value);
        let summary = DOMPurify.sanitize(document.getElementById('post-summary').value);

        appendPost(title, date, summary);

        let posts = JSON.parse(localStorage.getItem('posts')).posts;
        posts.push({postTitle: title, postDate: date, postSummary: summary});

        let updatedPosts = JSON.stringify({posts: posts});
        localStorage.setItem('posts', updatedPosts);

        promptDialog.close();
        document.body.removeChild(promptDialog);
    });

    let cancel = document.getElementById('closeDialogFalse');
    cancel.addEventListener("click", () => {
        promptDialog.close();
        document.body.removeChild(promptDialog);
    });
}

export function remove(id) {
    let posts = JSON.parse(localStorage.getItem('posts')).posts;
    let targetTitle = document.getElementById(`title-${id}`).innerHTML;

    // Remove target post from local storage
    for(let i = 0; i < posts.length; i++) {
        if(posts[i].postTitle == targetTitle) {
            posts.splice(i, 1);
        }
    }

    // Save to local storage
    let updatedPosts = JSON.stringify({posts: posts});
    localStorage.setItem('posts', updatedPosts);

    document.getElementById(`post-${id}`).remove();
}

export function edit(id) {
    let oldTitle = document.getElementById(`title-${id}`).innerText;
    let oldDate = document.getElementById(`date-${id}`).innerText;
    let oldSummary = document.getElementById(`summary-${id}`).innerText;

    let promptDialog = document.createElement('dialog');

    promptDialog.innerHTML = `
        <form id="add-form">
            <label for="post-title">Post Title:</label><br>
            <input type="text" autocomplete="off" id="post-title" name="post-title" value="${oldTitle}" required><br><br>

            <label for="post-date">Date:</label><br>
            <input type="date" id="post-date" name="post-date" value="${oldDate}"required><br><br>

            <label for="post-summary">Summary:</label><br>
            <textarea id="post-summary" autocomplete="off" style="width: 500px; height:200px"  name="post-summary" required>${oldSummary}</textarea><br><br>

            <button type="submit" id="closeDialogTrue">OK</button>
            <button id="closeDialogFalse">Cancel</button>
        </form>
    `;

    promptDialog.style.textAlign = 'left';
    document.body.appendChild(promptDialog);
    promptDialog.showModal();

    let ok = document.getElementById('closeDialogTrue');

    ok.addEventListener("click", () => {

        document.getElementById(`title-${id}`).innerText = DOMPurify.sanitize(document.getElementById('post-title').value);
        document.getElementById(`date-${id}`).innerText = DOMPurify.sanitize(document.getElementById('post-date').value);
        document.getElementById(`summary-${id}`).innerText = DOMPurify.sanitize(document.getElementById('post-summary').value);

        let posts = JSON.parse(localStorage.getItem('posts')).posts;

         // Find target post from local storage
        for(let i = 0; i < posts.length; i++) {
            if(posts[i].postTitle == oldTitle) {
                posts[i].postTitle = document.getElementById(`title-${id}`).innerText;
                posts[i].postDate = document.getElementById(`date-${id}`).innerText;
                posts[i].postSummary = document.getElementById(`summary-${id}`).innerText;
            }
        }

        console.log(posts)

        let updatedPosts = JSON.stringify({posts: posts});
        localStorage.setItem('posts', updatedPosts);

        promptDialog.close();
        document.body.removeChild(promptDialog);
    });

    let cancel = document.getElementById('closeDialogFalse');
    cancel.addEventListener("click", () => {
        promptDialog.close();
        document.body.removeChild(promptDialog);
    });
}