const users = [];


function createAndAddUser(username, id, roomname) {
    const user = {username, id, roomname};
    users.push(user);
    return user;
}


function getUser(id) {
    const user = users.find(element => element.id === id);
    return user;
}

function deleteUser(id) {
    if (users.length == 0) {
        return;
    }
    const index = users.findIndex(item => item.id === id);
    users.splice(index, 1);
}

function getUsers() {
    return users;
}

module.exports = {
    createAndAddUser,
    getUser,
    deleteUser,
    getUsers
};