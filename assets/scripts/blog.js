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
        <h3 id="title-${id}">${title}</h3>
        <time id="date-${id}" datetime="${date}" format="MM/DD/YYYY">${date}</time>
        <button id="edit-${id}" onclick="edit(${id})">Edit</button>
        <button id="delete-${id}" onclick="remove(${id})">Delete</button>
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