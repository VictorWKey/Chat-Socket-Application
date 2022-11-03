const form = document.querySelector('form');
const button = document.getElementById('google_signout');

const url = window.location.hostname.includes('localhost') 
                 ? 'http://localhost:8080/api/auth' 
                 : 'https://rest-server-crs.herokuapp.com/api/auth';

form.addEventListener('submit', (e) => {
    e.preventDefault();
        const formData = {};

    for(let i of form.elements){
        if( i.name.length > 0 ){
            formData[i.name] = i.value;
        }
    }

    fetch(url + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then( res => res.json()).then( ({errors, msg, token}) => {

        const errorValidations = errors;
        const errorCredentials = msg;

        if( errorValidations) {
            return console.error(errorValidations.errors[0].msg);
        }

        if( errorCredentials ) {
            return console.error(errorCredentials);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
        
    }).catch( err => console.log(err));

})




function handleCredentialResponse(response) {

    // Google Token (ID TOKEN)
    // console.log(response.credential);

    const body = { id_token: response.credential }

    // Aqui lo que hacemos es hacer una peticion POST con fetch y enviarle en el body el jwt para poder recibirlo en el controlador de ese mismo endpoint. Aqui no es necesario hacer algo con postman para confirmarlo porque la peticion la estamos haciendo con el fetch. La peticion POST en este endpoint enviara el id_token y ademas en el controlador estamos enviando un msg en caso de que se haga una peticion post ahi, por eso es que fetch regresa las dos cosas. A fuerza tenemos que enviar toda la configuracion del POST con fetch 
    fetch(url + '/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(body) // Cuando hacemos un post debemos enviar la info serializada. Aqui solo enviamos la info por el body (y la recibe {id_token} = req.body en el controlador), pero lo que realmente fetch muestra en su respuesta, es la respuesta enviada en el controlador.
    }).then(res => res.json()).then(( { token, user } )=> {

        localStorage.setItem('token', token );
        localStorage.setItem('email', user.email );
        window.location = 'chat.html';

    }).catch( console.warn ); 
    // Con esto, el id_token podra ser controlado por nosotros en el backend (en el controlador)

 }



 button.addEventListener('click', () => {
     console.log(google.accounts.id);
     google.accounts.id.disableAutoSelect();
;

     google.accounts.id.revoke(localStorage.getItem('email'), done => {
         localStorage.clear();
         location.reload();
     });
 });