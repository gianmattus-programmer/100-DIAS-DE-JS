const searchGithub = async () => {
    const username = document.getElementById("searchInput").value;
    const response = await fetch(`https://api.github.com/users/${username}`);
    const detailsContainer = document.querySelector(".details");
    const data = await response.json();

    if (response.ok) {
        detailsContainer.style.display = "flex";
        document.getElementById("result").innerHTML = `
            <div class="profile">
                <div class="profile-image">
                    <img src="${data.avatar_url}" />
                </div>
                <div class="profile-details">
                    <h2 class="name">${data.name || data.login}</h2>
                    <p class="username">@${data.login}</p>
                    <p class="bio">${data.bio || 'La cuenta no tiene biografía.'}</p>

                    <div class="stats">
                        <div>
                            <div class="stats-name">Repositorios Públicos</div>
                            <div class="stats-value">${data.public_repos}</div>
                        </div>
                        <div>
                            <div class="stats-name">Seguidores</div>
                            <div class="stats-value">${data.followers}</div>
                        </div>
                        <div>
                            <div class="stats-name">Siguiendo</div>
                            <div class="stats-value">${data.following}</div>
                        </div>
                    </div>

                <div class="media">
                    <p>
                        <span class="media-value">${data.location || 'No disponible'}</span>
                    </p>
                    <p>
                        <span class="media-value">${data.blog || 'No disponible'}</span>
                    </p>
                    <p>
                        <span class="media-value">${data.twitter_username || 'No disponible'}</span>
                    </p>
                    <p>
                        <span class="media-value">${data.company || 'No disponible'}</span>
                    </p>
                </div>
            </div>
        </div>
        `;
    } else {
        alert(data.message);
    }
}