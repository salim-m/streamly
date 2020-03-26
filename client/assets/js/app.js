const TwitchAPI = axios.create({
  baseURL: "https://api.twitch.tv/kraken",
  headers: {
    Accept: "application/vnd.twitchtv.v5+json",
    "Client-ID": "Your Client ID"
  }
});

const StreamlyAPI = axios.create({
  baseURL: "http://example.com/api"
});

const cutName = (name) => {
  if (name.length > 12) {
    return name.substring(0, 12) + '...';
  } else {
    return name;
  }
};
const resetStreams = () => {
  document.querySelector('.placeholder').innerHTML = `
  <div>
  <div class="uk-card uk-card-default">
      <div class="uk-cover-container uk-height-medium uk-card-body">
          <div class="uk-position-center">
              <div uk-spinner="ratio: 1.5"></div>
          </div>
      </div>
      <div class="uk-card-footer">&nbsp;</div>
  </div>
</div>
<div>
  <div class="uk-card uk-card-default">
      <div class="uk-cover-container uk-height-medium uk-card-body">
          <div class="uk-position-center">
              <div uk-spinner="ratio: 1.5"></div>
          </div>
      </div>
      <div class="uk-card-footer">&nbsp;</div>
  </div>
</div>
<div>
  <div class="uk-card uk-card-default">
      <div class="uk-cover-container uk-height-medium uk-card-body">
          <div class="uk-position-center">
              <div uk-spinner="ratio: 1.5"></div>
          </div>
      </div>
      <div class="uk-card-footer">&nbsp;</div>
  </div>
</div>
<div>
  <div class="uk-card uk-card-default">
      <div class="uk-cover-container uk-height-medium uk-card-body">
          <div class="uk-position-center">
              <div uk-spinner="ratio: 1.5"></div>
          </div>
      </div>
      <div class="uk-card-footer">&nbsp;</div>
  </div>
</div>
  `;
}
const searchStreams = async (searchTerm) => {
  await TwitchAPI.get('/search/games', {
    params: {
      query: encodeURI(searchTerm)
    }
  }).then(function (response) {
    console.log(response);
    if (response.data.games !== null) {
      document.getElementById('mainTitle').innerHTML = `Search result for "<span class="twitchTitle">${searchTerm}</span>"`;
      gameStreams(response.data.games[0].name);
    } else {
      featuredStreams(`No results for "<span class="twitchTitle">${searchTerm}</span>"!`);
    }
  });
};
const gameStreams = async (gameName) => {
  let data = "";
  await TwitchAPI.get('/streams', {
    params: {
      game: gameName,
      limit: 4
    }
  }).then(function (response) {
    if (response.status == 200) {
      response.data.streams.forEach(element => {
        data += `<div>
        <div class="uk-card uk-card-default">
        <div class="uk-card-badge uk-label live">Live</div>
            <div class="uk-cover-container uk-height-medium uk-card-body">
                <img src="${element.preview.large}" alt="stream" uk-cover/>
                <div class="uk-position-center">
                    <span uk-icon="icon: play-circle;ratio: 2.5" class="playButton" onClick=TwitchPlayer(this) data-stream="${element.channel.name}" data-stream-id="id${element.channel._id}"></span>
                </div>
            </div>
            <div class="uk-card-footer">
                <div class="uk-grid-small uk-flex-middle" uk-grid>
                    <div class="uk-width-auto">
                        <img class="uk-border-circle" width="40" height="40" src="${element.channel.logo}" uk-tooltip="title:${element.channel.url};pos: top-left;">
                    </div>
                    <div class="uk-width-expand">
                        <h3 class="uk-card-title uk-margin-remove-bottom">${cutName(element.channel.name)}</h3>
                        <p class="uk-text-meta uk-margin-remove-top">${element.game}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
      });
    }
  });
  document.querySelector('.placeholder').innerHTML = data;
};

const featuredStreams = async (message = 'Recommended <span class="twitchTitle">live</span> streams') => {
  let data = "";
  document.getElementById('mainTitle').innerHTML = message;
  await TwitchAPI.get("/streams/featured", {
    params: {
      limit: 4
    }
  }).then(function (response) {
    if (response.status == 200) {
      response.data.featured.forEach(element => {
        data += `<div>
        <div class="uk-card uk-card-default">
        <div class="uk-card-badge uk-label live">Live</div>
            <div class="uk-cover-container uk-height-medium uk-card-body">
                <img src="${element.stream.preview.large}" alt="stream" uk-cover/>
                <div class="uk-position-center">
                    <span uk-icon="icon: play-circle;ratio: 2.5" class="playButton" onClick=TwitchPlayer(this) data-stream="${element.stream.channel.name}" data-stream-id="id${element.stream.channel._id}"></span>
                </div>
            </div>
            <div class="uk-card-footer">
                <div class="uk-grid-small uk-flex-middle" uk-grid>
                    <div class="uk-width-auto">
                        <img class="uk-border-circle" width="40" height="40" src="${element.stream.channel.logo}" uk-tooltip="title:${element.stream.channel.url};pos: top-left;">
                    </div>
                    <div class="uk-width-expand">
                        <h3 class="uk-card-title uk-margin-remove-bottom">${cutName(element.stream.channel.name)}</h3>
                        <p class="uk-text-meta uk-margin-remove-top">${element.stream.game}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
      });
    }
  });
  document.querySelector('.placeholder').innerHTML = data;
};

const liveStreams = async () => {
  let data = "";
  await TwitchAPI.get("/streams/?stream_type=live&limit=4")
    .then(function (response) {
      if (response.status == 200) {
        response.data.streams.forEach(element => {
          data += `
                        <div>
    <div class="uk-card uk-card-default">
        <div class="uk-cover-container uk-height-medium uk-card-body">
            <img src="${element.preview.large}" alt="stream" uk-cover />
            <div class="uk-position-center">
                <span uk-icon="icon: play-circle;ratio: 2.5" class="playButton" onClick=TwitchPlayer(this) data-stream="https://player.twitch.tv/?channel=${element.channel.display_name}"></span>
            </div>
        </div>
        <div class="uk-card-footer">
            <div class="uk-grid-small uk-flex-middle" uk-grid>
                <div class="uk-width-auto">
                    <img class="uk-border-circle" width="40" height="40" src="${element.channel.logo}">
                </div>
                <div class="uk-width-expand">
                    <h3 class="uk-card-title uk-margin-remove-bottom">${element.channel.display_name}</h3>
                    <p class="uk-text-meta uk-margin-remove-top">${element.game}</p>
                </div>
            </div>
        </div>
        
        
    </div>
</div>`;
        });
      }
    });
  document.querySelector(".liveStreams").innerHTML = data;
};

function parent(element, n = 1) {
  let {
    parentNode
  } = element;
  for (let i = 1; parentNode && i < n; i++) {
    ({
      parentNode
    } = parentNode);
  }
  return parentNode;
}

const TwitchPlayer = element => {
  const channelName = element.getAttribute("data-stream");
  const parentNode = parent(element, 3);
  const secondDiv = parentNode.getElementsByTagName('div')[1];
  const playerId = element.getAttribute("data-stream-id")
  secondDiv.innerHTML = `<div id="${playerId}" uk-cover></div>`;
  var player = new Twitch.Player(playerId, {
    channel: channelName,
    width: '100%',
    height: '100%',
  });
  player.setVolume(0.5);

};

document.querySelector('#searchForm').addEventListener('submit', (e) => {
  //prevent the form action
  e.preventDefault();
  const q = document.getElementById('searchText').value;
  document.getElementById('searchText').value = '';
  UIkit.offcanvas('#offcanvas-push').hide();
  if (q.length === 0) {
    featuredStreams();
  } else {
    resetStreams();
    searchStreams(q);

  }
  //search
  resetStreams();
  searchStreams(q);
});
featuredStreams();
let i = 0;
const games = [
  'PlayerUnknown\'s Battlegrounds',
  'Tom Clancy\'s Rainbow Six Siege',
  'Counter-Strike: Global Offensive',
  'Dota 2',
  'Destiny 2',
  'Call Of Duty',
  'Minecraft',
  'Super Mario Bros.',
  'Apex Legends',
  'Fortnite',
  'Red Dead Redemption 2',
  'Grand Theft Auto V',
  'Metal Gear',
  'The Witcher',
  'Overwatch',
  'Far Cry',
  'Resident Evil 2',
  'God of War',
  'Outer Wilds',
  'Spore',
  'Ring of Elysium',
  'BioShock',
  'Planet Coaster',
  'Forza Horizon 4',
  'Control',
  'Hearthstone',
  'Dark Souls',
  'Bloodborne',
  'Cuphead',
  'Portal 2',
  'Punch Club',
  'DOOM'
];
setInterval(() => {
  if (games.length === i) i = 0;
  document.getElementById('searchText').setAttribute('placeholder', games[i]);
  i++;
}, 1200);

console.log(document.querySelectorAll('#email'));
document.querySelectorAll('#email').forEach(function (element) {
  element.addEventListener('blur', (e) => {
    if (!(/^\S+@\S+\.\S+$/.test(e.target.value))) {
      e.target.style.borderColor = '#eb2046';
    } else {
      e.target.style.borderColor = '';
    }
  });
});

document.querySelectorAll('#email, #password').forEach(function (element) {
  element.addEventListener('input', (e) => {
    e.target.style.borderColor = '';
    document.querySelectorAll('#errorPasswordField, #errorEmailField').forEach(function (elem) {
      elem.innerHTML = '';
    });
  });
});
//
const showUser = (name) => {
  document.querySelector('#user').innerHTML = `
  <span uk-icon="icon: user" class="uk-margin-right"></span>
  <div uk-dropdown>
      <ul class="uk-nav uk-dropdown-nav">
          <li><a href="#">Howdy, ${name}!</a></li>
          <li class="uk-nav-divider"></li>
          <li><a href="#"><span uk-icon="icon: cog; ratio:0.8"></span> Account Settings</a></li>
          <li><a href="#"><span uk-icon="icon: lock; ratio:0.8"></span> Change password</a></li>
          <li><a href="#"><span uk-icon="icon: sign-out; ratio:0.8"></span> Sign Out</a></li>
      </ul>
  </div>
  `;
}
document.querySelectorAll('#password, #name').forEach(function (element) {
  element.addEventListener('blur', (e) => {
    if (e.target.value === '') {
      e.target.style.borderColor = '#eb2046';
    } else {
      e.target.style.borderColor = '';
    }
  });
});
const createNotification = (message, status = 'primary') => {
  UIkit.notification({
    message,
    status,
    pos: 'top-right',
    timeout: 2000
  });
}
const controlLogin = (option) => {
  if (option === 'show') {
    document.querySelector('#loginSpinner').style.display = 'block';
    document.querySelector('#createLogin').style.display = 'none';
  } else if (option === 'hide') {
    document.querySelector('#loginSpinner').style.display = 'none';
    document.querySelector('#createLogin').style.display = 'block';
  }
}
document.querySelector('#loginForm').addEventListener('submit', (e) => {
  const thisElement = e.target;
  e.preventDefault();
  controlLogin('show');
  const email = thisElement.querySelector('#email').value;
  const password = thisElement.querySelector('#password').value;
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);
  params.append('action', 'signin');
  StreamlyAPI.post('/api.php', params)
    .then(function (response) {
      if (response.data.message.indexOf('password') !== -1) {
        thisElement.querySelector('#errorEmailField').innerHTML = '';
        thisElement.querySelector('#errorPasswordField').innerHTML = 'This password is incorrect!';
        thisElement.querySelector('#password').style.borderColor = '#eb2046';
        thisElement.querySelector('#email').style.borderColor = '';
        controlLogin('hide');
      } else if (response.data.message.indexOf('address') !== -1) {
        thisElement.querySelector('#errorEmailField').innerHTML = 'This account does not exist!';
        thisElement.querySelector('#errorPasswordField').innerHTML = '';
        thisElement.querySelector('#email').style.borderColor = '#eb2046';
        thisElement.querySelector('#password').style.borderColor = '';
        controlLogin('hide');
      } else if (response.data.message.indexOf('verified') !== -1) {
        thisElement.querySelector('#errorEmailField').innerHTML = 'This account is not yet verified!';
        thisElement.querySelector('#errorPasswordField').innerHTML = '';
        thisElement.querySelector('#email').style.borderColor = '#eb2046';
        thisElement.querySelector('#password').style.borderColor = '';
        controlLogin('hide');
      } else {
        UIkit.offcanvas('#offcanvas-push').hide();
        document.querySelector('#loginForm').innerHTML = '';
        showUser(response.data.username);
      }
    });
});

document.querySelector('#signup-btn').addEventListener('click', (e) => {
  UIkit.modal('#signup-modal').show();
});
document.querySelector('#signupForm').addEventListener('submit', (e) => {
  const thisElement = e.target;
  e.preventDefault();
  const email = thisElement.querySelector('#email').value;
  const password = thisElement.querySelector('#password').value;
  const name = thisElement.querySelector('#name').value;
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);
  params.append('name', name);
  params.append('action', 'signup');
  StreamlyAPI.post('/api.php', params)
    .then(function (response) {
      if (response.data.message.indexOf('exists') !== -1) {
        thisElement.querySelector('#email').style.borderColor = '#eb2046';
        thisElement.querySelector('#errorEmailField').innerHTML = 'This email address is already being used!';
        thisElement.querySelector('#green').innerHTML = '';
      } else {
        thisElement.querySelector('#email').style.borderColor = '';
        thisElement.querySelector('#errorEmailField').innerHTML = '';
        thisElement.querySelector('#green').innerHTML = 'Done! To start using Streamly, check your email and click the activation link.';
      };
    });
});