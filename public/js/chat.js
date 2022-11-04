const txtUid = document.querySelector('#txtUid'); 
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMsg = document.querySelector('#ulMsg');
const btnLogout = document.querySelector('#btnLogout');

let user = null;
let socket = null;

txtMsg.addEventListener('keyup', ({ keyCode }) => {

    const message = txtMsg.value;
    const uid = txtUid.value;


    if(keyCode !== 13) { return; }
    if(message.length === 0) { return; }

    socket.emit('send-message', { message, uid });

    txtMsg.value = '';

})


const url = window.location.hostname.includes('localhost') 
                 ? 'http://localhost:8080/api/auth' 
                 : 'https://rest-server-crs.herokuapp.com/api/auth';

const showUsers = (users = '') => {
    let usersHtml = '';

    users.forEach( ({name, uid}) => {
        usersHtml += `
        <li>
            <p>
                <h5 class="text-success"> ${name} </h5>
                <span class="fs-6 text-muted"> ${uid} </span>
            </p>
        </li>
        `
    })

    ulUsers.innerHTML = usersHtml;
}

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('receive-msg', (payload) => {
        console.log(payload);        
    })

    socket.on('active-users', showUsers)

    socket.on('private-msg', () => {
        // TODO:
    })
};

const validateJwtOfLS = async () => {
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('JWT required in server')
    }

    const res = await fetch( url, {
        headers: {
            'x-token': token
        }
    })

    const { userAuth: userDB, token: tokenDB, msg} = await res.json();

    if( msg ) {
        window.location = 'index.html';
        throw new Error(msg);
    }

    localStorage.setItem('token', tokenDB);
    
    user = userDB;
    document.title = user.name;

    await connectSocket();
};

const main = async () => {

    await validateJwtOfLS();


};

main();