## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| contracts/AssetStorage.sol | 37f2952a44f609924160cd87c445a3f22c9202d2 |
| contracts/ComputerRegistry.sol | 7b839d4926e8a34a979f087c58b596ee55f28736 |
| contracts/Interfaces.sol | 9bdbf2ec0a30589b1ef524671baf255b211a12f9 |
| contracts/Item.sol | fa253cc06ba94fe98c6eb7bb24f2fee23c18cecb |
| contracts/RatingComputer.sol | 633b721e6b1488fc419e9776e35618f6d8628fa0 |
| contracts/RatingLibrary.sol | a87a9a8c47be713c4062d7632e937f3daa2249c7 |
| contracts/RatingSystem.sol | f67fff5223cf1b62e7c28124c794677bab47f763 |
| contracts/User.sol | d49c6698abd228c0610898d19ae8907d1599411f |


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
| **OwnableStoragePointer** | Implementation | StoragePointer, Ownable |||
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
| └ | grantPermission | Public ❗️ | 🛑  | isOwner |
| └ | revokePermission | Public ❗️ | 🛑  | |
| └ | checkForPermission | Public ❗️ |   | |
| └ | getPolicy | External ❗️ |   | |
||||||
| **Item** | Implementation | Permissioned |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Permissioned |
| └ | destroy | External ❗️ | 🛑  | isOwner |
| └ | grantPermission | Public ❗️ | 🛑  | isOwner |
| └ | addRate | External ❗️ | 🛑  | |
| └ | computeScore | External ❗️ |   | |
| └ | getAllRatings | Public ❗️ |   | |
| └ | ratingCount | External ❗️ |   | |
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
||||||
| **User** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | destroy | External ❗️ | 🛑  | isOwner |
| └ | addRate | External ❗️ | 🛑  | isOwner |
| └ | createItem | External ❗️ | 🛑  | isOwner |
| └ | deleteItem | External ❗️ | 🛑  | isOwner |
| └ | getAllRatings | External ❗️ |   | |
| └ | getItems | External ❗️ |   | |
| └ | isIn | External ❗️ |   | |
| └ | iAmRegisteredUser | External ❗️ |   | |
| └ | itemCount | External ❗️ |   | |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
