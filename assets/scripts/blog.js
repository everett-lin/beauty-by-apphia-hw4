// Init and create local storage on user's first load
export async function init() {
    if(localStorage.getItem('posts') !== null) {
        console.log('Local storage exists!');
    } else {
        console.log('Local storage does not exist. Populating with default values...');

        // Async to prevent initBlog() from running before population is complete
        await populate('/assets/scripts/defaultposts.json');
    }
    initBlog();
}

// Uses default values from JSON to create default posts
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
        appendPost(posts[i].postTitle, posts[i].postDate, posts[i].postSummary);
    };
}

// Helper to write new post to screen
function appendPost(title, date, summary) {
    let bs = document.getElementById('blog-section');

    let post = document.createElement('div');
    post.innerHTML = `
        <hr>
        <h3>${title}</h3>
        <time datetime="${date}" format="MM/DD/YYYY">${date}</time>
        <button>Edit</button>
        <button onclick="Blog.test(1)">Delete</button>
        <p>${summary}</p>
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

        // Save new post to local storage as well
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

export function test() {
    alert(1);
}