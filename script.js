function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function createPostHTML(post) {
  const likes = formatNumber(post.likes_count);
  const comments = formatNumber(post.comments_count);

  let media = "";

  if (post.media_type === "IMAGE") {
    media = `
    <a href=${post.media.url}>
      <img src="${post.media.url}" alt="img" class="post-img" />
    </a>`;
  } else if (post.media_type === "VIDEO") {
    media = `
      <video data-setup="{}" controls id="my-video" class="video-js">
        <source src="${post.media.url}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
  }

  return `
      <div class="post" id="${post.id}">
        <div class="profile-post">
          <img src="${
            post.user.profile_picture_url
          }" alt="profile" class="profile-picture" />
          <div class="username">
            <span class="name">${post.user.full_name}<p class="date">${
    post.user.username
  }</p></span>
            <p class="date">${formatDate(post.timestamp)}</p>
        </div>
        <i class="fa-solid fa-ellipsis"></i>
        </div>
        <p class="caption">${post.caption}</p>
        ${media}
        <div class="media-action">
            <i class="fa fa-heart-o"></i>
            <i class="fa fa-comment-o"></i>
            <i class="fa fa-paper-plane-o"></i>
        </div>
        <div class="socials">
            <p class="likes">${likes} likes</p>
            <p class="comments">${comments} comments</p>
        </div>
      </div>
    `;
}

async function fetchPosts() {
  try {
    const response = await fetch("posts.json");
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    return [];
  }
}

async function displayPosts() {
  const container = document.getElementById("right-container");
  const gridContainer = document.getElementById("grid-container");
  const jsonData = await fetchPosts();

  jsonData.forEach((post) => {
    const postHTML = createPostHTML(post);
    container.innerHTML += postHTML;

    const imgElement = document.createElement("img");
    imgElement.src = post.media.thumbnail_url;
    imgElement.alt = post.caption;

    const linkElement = document.createElement("a");
    linkElement.href = `#${post.id}`;
    linkElement.appendChild(imgElement);

    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.appendChild(linkElement);

    gridContainer.appendChild(gridItem);
  });
}

displayPosts();
