const cafelist = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');
//create element and render cafe

function rendercafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');


    li.setAttribute('data-id',doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';


    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);


    cafelist.appendChild(li);

    //deleting data directly from the database

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id'); //we get the unique id of each item on the list from this line of code and stored in id varible.
        db.collection('myproject').doc(id).delete();
    })


}

//GETTING DATA from the firestore
/*db.collection('myproject').get().then((snapshot) => {       //this how we get or retreive data from firestore database.
    snapshot.docs.forEach(doc => {
        rendercafe(doc);
          //to see the data in console which is written in database firestore
    })
})*/

//saving data to the firestore.

form.addEventListener('submit',(e) => {
    e.preventDefault();   //prevents the page from relaoding after cilcking the add cafe button

    db.collection('myproject').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value= '';
    form.city.value= '';    //after adding the new value to the cafelist making it empty to add new cafe and its city.
})

//realtime listener

db.collection('myproject').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            rendercafe(change.doc);
        }
        else if(change.type == 'removed'){
            let li = cafelist.querySelector('[data-id=' + change.doc.id + ']');
            cafelist.removeChild(li);
        }
        
    });
})

