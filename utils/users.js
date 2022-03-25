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
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getUsers(room) {
    return users.filter(user => user.roomname === room);
}

module.exports = {
    createAndAddUser,
    getUser,
    deleteUser,
    getUsers
};