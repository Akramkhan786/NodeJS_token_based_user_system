const Realm = require('realm')
const USER_SCHEMA = "User"
const ADDRESS_SCHEMA = "Address"
const Promise = require('promise')

const AddressSchema = {
    name: ADDRESS_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int', // Primary Key
        street: 'string',
        city: 'string',
        state: 'string?', //optional property
    }
}
const UserSchema = {
    name: USER_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: {type: 'string', indexed: true},
        email: 'string',
        addresses: { type: 'list', objectType: ADDRESS_SCHEMA},
    }
}
const databaseOptions = {
    path: 'RealmInNodeJS.realm',
    schema: [UserSchema, AddressSchema],
    schemaVersion: 0,
}
const insertNewUser = newUser => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        //check of existing user
        let filteredUsers = realm.objects(USER_SCHEMA)
                                .filtered(`name= '${newUser.name.trim()}' AND email='${newUser.email.trim()}'`)
        if (filteredUsers.length > 0) {
            reject("User with the same name and email exists !")
        }
        realm.write(() => {
            newUser.id = Math.floor(Date.now())
            realm.create(USER_SCHEMA, newUser)
            resolve(newUser)
        })
    }).catch((error) => reject(error))
})

const filterUsersByName = (searchedName) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let filteredUsers = realm.objects(USER_SCHEMA).filtered(`name CONTAINS[c] '${searchedName}'`)
        resolve(filteredUsers)
    }).catch(error => {
        reject(error)
    })
})

//Update an existing User
const updateAnUser = (userId, updatingUser) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let user = realm.objectForPrimaryKey(USER_SCHEMA, userId)
            if(!user){
                reject(`Cannot find user with ID=${userId} to update`)
                return
            }
            user.name = updatingUser.name
            user.email = updatingUser.email
            resolve() 
        });
    }).catch((error) => reject(error))
})

// function for AddressSchema
const insertAddressToUser = (userId, addressObject) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        const { street, city, state } = addressObject
        let userObject = realm.objectForPrimaryKey(USER_SCHEMA, userId);
        let filteredAddresses = userObject.addresses
                                .filtered(`street='${street.trim()}' AND city='${city.trim()}'`)
        if (filteredAddresses.length > 0) {
            reject("Address with the street and city exists !")
        }
        realm.write(() => {
            let newAddress = {
                id: Math.floor(Date.now()),
                street, city, state
            }
            userObject.addresses.push(newAddress)
            resolve()
        })

    }).catch((error) => reject(error))
})

//function to delete user
const deleteUser = (userId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let userObject = realm.objectForPrimaryKey(USER_SCHEMA, userId);
        if (!userObject) {
            reject(`Cannot find user with ID=${userId} to delete`)
        }
        realm.write(() => {
            realm.delete(userObject.addresses);
            realm.delete(userObject);
            resolve();
        });
    }).catch((error) => reject(error));
});

//function to delete AllUsers
const deleteAllUsers = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let allUsers = realm.objects(USER_SCHEMA);
            for (var index in allUsers) {
                let eachuser = allUsers[index]
                realm.delete(eachuser.addresses);
            }
            realm.delete(allUsers)
            resolve()
        });
    }).catch((error) => reject(error))
})
  
module.exports = {
    insertNewUser,
    filterUsersByName,
    updateAnUser,
    insertAddressToUser,
    deleteUser,
    deleteAllUsers
}
