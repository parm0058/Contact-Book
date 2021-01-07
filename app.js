 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyDvaXqZozkCvH8pClx7mzntFH-7qxUFojE",
    authDomain: "contact-firestore-19bde.firebaseapp.com",
    projectId: "contact-firestore-19bde",
    storageBucket: "contact-firestore-19bde.appspot.com",
    messagingSenderId: "1028050492528",
    appId: "1:1028050492528:web:c65012ae11cc57c537e8b5",
    measurementId: "G-VDQGF1D7QY"
  };
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const contactList = {
    data: function () {
        return {
            contacts: [],
            q: ''
        }
    },
    computed: {
        filteredData () {
            return this.contacts.filter(contact => {
                return contact.query.includes(this.q.toLowerCase())
            })
        }
    },
    mounted: function () {
        db.collection('contacts').orderBy('lastName').onSnapshot(snapshot => {
            const data = []
            snapshot.forEach(doc => {
                data.push({ id: doc.id, data: doc.data(), query: doc.data().lastName.toLowerCase() })
            })
            this.contacts = data
        })
    },
    template: `
    <section>
    <div class="row">
          <div class="col-md-9">
            <div class="form">
              <input class="form-control" type="text" placeholder="Search" aria-label="Search" v-model=q>
            </div>
          </div>
          <div class="col-md-3">
             <router-link to="/add/">Add New</router-link>
          </div>
        </div>
            <ul class="list-group list-group-flush" style="max-height: 40rem; overflow-y: scroll;">
                <li class="list-group-item" v-for="contact in filteredData">
                    <router-link :to="'/contact/' + contact.id">{{contact.data.firstName}} {{contact.data.lastName}}</router-link>
                </li>
            </ul>
            </section>
  `
}


const contact = {
    props: ['id'],
    data: function () {
        return {
            contact: {
                email: '',
                name: ''
            }
        }
    },
    mounted: function () {
        db.collection('contacts').doc(this.id).get().then(
            doc => {
                if (doc.exists) {
                    this.contact.email = doc.data().email
                    this.contact.name = doc.data().firstName + ' ' + doc.data().lastName
                } else {

                }
            }
        )
    },
    template: `
    <section>
    <router-link to="/">< Back to list</router-link>
    <div class="row">
      <div class="col-md-9">
        <h2 v-show=contact.name>{{ contact.name }}</h2>
      </div>
      <div class="col-md-3">
        <router-link :to="'/edit/' + this.id">Edit</router-link>
      </div>
    </div>
        
        <ul class="list-group list-group-flush">
            <li class="list-group-item">
                <h5>Email</h5>
                <p>{{ contact.email }}</p>
            </li>
        </ul>
        </section>
    `
}


const editContact = {
    props: ['id'],
    data: function () {
        return {
            contact: {
                email: '',
                firstName: '',
                lastName: ''
            }
        }
    },
    mounted: function () {
        db.collection('contacts').doc(this.id).get().then(
            doc => {
                if (doc.exists) {
                    this.contact.email = doc.data().email
                    this.contact.firstName = doc.data().firstName
                    this.contact.lastName = doc.data().lastName
                } else {

                }
            }
        )
    },
    methods: {
        updateContact: function () {
            if (!this.contact.firstName) {
                alert("First Name is Required!")
            } else if (!this.contact.lastName) {
                alert("Last Name is Required!")
            } else if (!this.contact.email) {
                alert("Email is required!")
            } else {
                db.collection('contacts').doc(this.id).update({
                    email: this.contact.email,
                    firstName: this.contact.firstName,
                    lastName: this.contact.lastName,
                }).then(() => this.$router.push('/contact/' + this.id))
            }
        },
        deleteContact: function () {
            db.collection('contacts').doc(this.id).delete().then(() => this.$router.push('/'))
        }
    }
    ,
    template: `
    <section>
        <div class="row">
            <div class="col-md-9">
                <h2>Edit Contact</h2>
            </div>
            <div class="col-md-3">
                <button class="btn btn-danger" @click.prevent="deleteContact">Delete</button>
            </div>
        </div>
        <form class="text-center">
            <div class="form-row">
                <div class="col">
                    <div class="form">
                        <label for="formFirstName">First name</label>    
                        <input type="text" id="formFirstName" class="form-control" v-model=contact.firstName>
                    </div>
                </div>
                <div class="col">
                    <div class="form">
                        <label for="formLastName">Last name</label>
                        <input type="text" id="formLastName" class="form-control" v-model=contact.lastName>    
                    </div>
                </div>
            </div>
            <div class="form my-3">
                <label for="formEmail">E-mail</label>
                <input type="email" id="formEmail" class="form-control" v-model=contact.email>
            </div>
            <button class="btn btn-success" @click.prevent="updateContact">Update</button>
        </form>
        </section>
    `
}

const addContact = {
    data: function () {
        return {
            contact: {
                email: '',
                firstName: '',
                lastName: ''
            }
        }
    },
    methods: {
        addContact: function () {
            if (!this.contact.firstName) {
                alert("First Name is Required.")
            } else if (!this.contact.lastName) {
                alert("Last Name is Required.")
            } else if (!this.contact.email) {
                alert("Email is Required.")
            } else {
                db.collection('contacts').add({
                    email: this.contact.email,
                    firstName: this.contact.firstName,
                    lastName: this.contact.lastName
                }).then(doc => this.$router.push('/contact/' + doc.id))
            }

        }
    }
    ,
    template: `
    <section>
        <h2 class="text-center">Add Contact</h2>
        <form class="text-center">
            <div class="form-row">
                <div class="col">
                    <div class="form">
                        <label for="formFirstName">First name</label>    
                        <input type="text" id="formFirstName" class="form-control" v-model=contact.firstName>
                    </div>
                </div>
                <div class="col">
                    <div class="form">
                        <label for="formLastName">Last name</label>
                        <input type="text" id="formLastName" class="form-control" v-model=contact.lastName>    
                    </div>
                </div>
            </div>
            <div class="form my-3">
                <label for="formEmail">E-mail</label>
                <input type="email" id="formEmail" class="form-control" v-model=contact.email>
            </div>
            <button class="btn btn-success" @click.prevent="addContact">Add Contact</button>
        </form>
        </section>
    `
}



const routes = [
    { path: '/', name: 'Home', component: contactList },
    { path: '/contact/:id', name: 'Contact', component: contact, props: true },
    { path: '/edit/:id', name: 'Edit', component: editContact, props: true },
    { path: '/add', name: 'Add', component: addContact }
]

const router = new VueRouter({
    routes: routes
})

const app = new Vue({
    el: '#app',
    router: router,
})
