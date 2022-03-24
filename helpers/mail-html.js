
exports.mailFormat = (user,password) => {
    
    const userDetails = "<p><b>UserName: </b><label>" + user.userName + "</label></p>" +
        "<p><b>Password: </b><label>" + password + "</label></p>" +
        "<p><b>Name: </b><label>" + user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + " " + user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1) + "</label></p>" +
        "<p><b>FirmName: </b><label>" + user.firmName.charAt(0).toUpperCase() + user.firmName.slice(1) + "</label></p>" +
        "<p><b>Email: </b><label>" + user.email + "</label></p>" +
        "<p><b>Phone: </b><label>" + user.phone + "</label></p>" +
        "<p><b>Address Line1: </b><label>" + user.address.line1.charAt(0).toUpperCase() + user.address.line1.slice(1) + "</label></p>" +
        "<p><b>Address Line2: </b><label>" + user.address.line2.charAt(0).toUpperCase() + user.address.line2.slice(1) + "</label></p>"

    return userDetails
}