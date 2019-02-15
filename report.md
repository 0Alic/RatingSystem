## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| contracts/AssetStorage.sol | 4a3c4a1002a08882b80d2168ae76247cce82fb1a |
| contracts/ComputerRegistry.sol | 97344883b338a4ec2acfe322dfcb075a92c39aea |
| contracts/Interfaces.sol | 72d588ab26055232f68aeeb5f3888079f639394a |
| contracts/Item.sol | 60eae9875b42c5e047175722892fd9c30298ac1e |
| contracts/Migrations.sol | b6732a145e4cb6841945488f591b1cf383a6441e |
| contracts/RatingComputer.sol | 633b721e6b1488fc419e9776e35618f6d8628fa0 |
| contracts/RatingLibrary.sol | a87a9a8c47be713c4062d7632e937f3daa2249c7 |
| contracts/RatingSystem.sol | 3aaee11b90d3f0103b2842b518113273f818bb97 |
| contracts/Token.sol | 9f64a19999ff657e0594ecbe38591937bc81b5fc |
| contracts/User.sol | 8e64d969ce73ef89129d3b685b6d1374d45aa55a |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **AssetStorage** | Implementation |  |||
| └ | insert | Public ❗️ | 🛑  | |
| └ | remove | Public ❗️ | 🛑  | |
| └ | isIn | Public ❗️ |   | |
| └ | getCount | External ❗️ |   | |
| └ | getAssets | External ❗️ |   | |
||||||
| **StoragePointer** | Implementation | AssetStorage |||
| └ | insert | Public ❗️ | 🛑  | |
| └ | remove | Public ❗️ | 🛑  | |
| └ | isIn | Public ❗️ |   | |
| └ | getCount | External ❗️ |   | |
| └ | getAssets | External ❗️ |   | |
| └ | getKeyAt | External ❗️ |   | |
||||||
| **OwnableCRUDStorage** | Implementation | StoragePointer, Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | insert | Public ❗️ | 🛑  | isOwner |
| └ | remove | Public ❗️ | 🛑  | isOwner |
||||||
| **ComputerRegistry** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | pushComputer | External ❗️ | 🛑  | isOwner |
| └ | getComputer | External ❗️ |   | |
| └ | getIds | External ❗️ |   | |
||||||
| **Ownable** | Implementation |  |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | |
| └ | changeOwner | External ❗️ | 🛑  | isOwner |
||||||
| **Permissioned** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | grantPermission | External ❗️ | 🛑  | isOwner |
| └ | revokePermission | Public ❗️ | 🛑  | |
| └ | checkForPermission | Public ❗️ |   | |
| └ | getMyPolicy | External ❗️ |   | |
||||||
| **Item** | Implementation | Permissioned |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Permissioned |
| └ | rate | External ❗️ | 🛑  | |
| └ | changeComputer | External ❗️ | 🛑  | isOwner |
| └ | computeRate | External ❗️ |   | |
| └ | getAllRatings | Public ❗️ |   | |
| └ | ratingCount | External ❗️ |   | |
||||||
| **Migrations** | Implementation |  |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | |
| └ | setCompleted | Public ❗️ | 🛑  | restricted |
| └ | upgrade | Public ❗️ | 🛑  | restricted |
||||||
| **RatingComputer** | Interface |  |||
| └ | compute | External ❗️ |   | |
||||||
| **SimpleAvarageComputer** | Implementation | RatingComputer |||
| └ | compute | External ❗️ |   | haveEqualLength |
||||||
| **WeightedAverageComputer** | Implementation | RatingComputer |||
| └ | compute | External ❗️ |   | haveEqualLength |
||||||
| **RatingLibrary** | Library |  |||
||||||
| **RatingSystemFramework** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | createUser | External ❗️ | 🛑  | |
| └ | deleteUser | External ❗️ | 🛑  | |
| └ | getMyUserContract | External ❗️ |   | |
| └ | getUsers | External ❗️ |   | |
| └ | isIn | External ❗️ |   | |
| └ | userCount | External ❗️ |   | |
| └ | getUserByIndex | External ❗️ |   | |
||||||
| **RateToken** | Implementation | ERC721, ERC721Enumerable, ERC721Metadata, Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | ERC721Metadata Ownable |
||||||
| **User** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | createItem | External ❗️ | 🛑  | isOwner |
| └ | deleteItem | External ❗️ | 🛑  | isOwner |
| └ | getItems | External ❗️ |   | |
| └ | isIn | External ❗️ |   | |
| └ | itemCount | External ❗️ |   | |
| └ | getItemByIndex | External ❗️ |   | |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
