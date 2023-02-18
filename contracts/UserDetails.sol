// SPDX-License-Identifier: MIT
// pragma solidity >=0.8.2 <0.9.0;

// contract UserDetails {
//     mapping(address => User) users;

//     struct User {
//         string name;
//         uint phoneNumber;
//         address userAddress;
//     }

//     function setInformation(string memory _name, uint _phoneNumber) public {
//         users[msg.sender].name = _name;
//         users[msg.sender].phoneNumber = _phoneNumber;
//         users[msg.sender].userAddress = msg.sender;
//     }

//     function retrieveInformation()
//         public
//         view
//         returns (string memory, uint, address)
//     {
//         address userAddress = msg.sender;
//         User storage user = users[userAddress];
//         return (user.name, user.phoneNumber, msg.sender);
//     }
// }

pragma solidity >=0.8.2 <0.9.0;

contract UserDetails {
    mapping(address => User) private users;
    struct User {
        string name;
        uint phoneNumber;
        address userAddress;
    }

    function setUserInformation(string memory _name, uint _phoneNumber) public {
        users[msg.sender].userAddress = msg.sender;
        users[msg.sender].name = _name;
        users[msg.sender].phoneNumber = _phoneNumber;
    }

    function retrieveUserInformation()
        public
        view
        returns (string memory, uint)
    {
        address userAddress = msg.sender;
        User memory user = users[userAddress];
        return (user.name, user.phoneNumber);
    }

    struct Location {
        address userAddress;
        string pickupLocation;
        string dropoffLocation;
    }

    Location[] location;

    function addLocation(
        string memory pickupLocation,
        string memory dropoffLocation
    ) public {
        Location memory newLocation = Location(
            msg.sender,
            pickupLocation,
            dropoffLocation
        );
        location.push(newLocation);
    }

    function getLocation() public view returns (Location[] memory) {
        return location;
    }

    function deleteLocation(uint index) public {
        delete location[index];
        for (uint i = index; i < location.length - 1; i++)
            location[i] = location[i + 1];
        location.pop();
    }
}
