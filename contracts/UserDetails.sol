// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract UserDetails {
    mapping(address => User) users;

    struct User {
        string name;
        uint phoneNumber;
        address userAddress;
    }

    function setInformation(string memory _name, uint _phoneNumber) public {
        users[msg.sender].name = _name;
        users[msg.sender].phoneNumber = _phoneNumber;
        users[msg.sender].userAddress = msg.sender;
    }

    function retrieveInformation()
        public
        view
        returns (string memory, uint, address)
    {
        address userAddress = msg.sender;
        User storage user = users[userAddress];
        return (user.name, user.phoneNumber, msg.sender);
    }
}
