const users = [];

// creates a user and adds the user onto the stack
function createAndAddUser(username, id) {
    const user = {username, id};
    users.push(user);
    return user;
}

//gets a user based off its id
function getUser(id) {
    const user = users.find(element => element.id === id);
    return user;
}

//deletes the user with a specific id and returns the deleted user
function deleteUser(id) {
    if (users.length == 0) {
        return;
    }
    const index = users.findIndex(item => item.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//returns an array of the users in that room
function getUsers() {
    return users;
}

//returns true or false if a username is in a roomname
function containUser(roomname, username) {
    const userlist = users.filter(user => (user.roomname == roomname) && (user.username == username))

    return (userlist.length != 0);
}

module.exports = {
    createAndAddUser,
    getUser,
    deleteUser,
    getUsers,
    containUser
};